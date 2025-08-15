const nodemailer = require('nodemailer');

// Rate limiting map (in-memory for simplicity)
const submissionTracker = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Rate limiting check
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'Too many submissions. Please try again later.' })
      };
    }

    // Generate unique lead ID for tracking
    const leadId = generateLeadId(formData);
    
    // Send notifications
    const results = await Promise.allSettled([
      sendAdminNotification(formData, leadId),
      sendWelcomeEmail(formData)
    ]);

    const [adminResult, welcomeResult] = results;

    // Log results
    console.log('Admin notification:', adminResult);
    console.log('Welcome email:', welcomeResult);

    // Check if at least one email was sent successfully
    if (adminResult.status === 'rejected' && welcomeResult.status === 'rejected') {
      throw new Error('Failed to send notifications');
    }

    // Log successful submission
    console.log(`Form submission processed for: ${formData.name} (${formData.email})`);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        leadId: leadId,
        details: {
          adminEmailSent: adminResult.status === 'fulfilled',
          welcomeEmailSent: welcomeResult.status === 'fulfilled'
        }
      })
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process form submission',
        message: error.message
      })
    };
  }
};

// Simple admin notification using nodemailer
async function sendAdminNotification(formData, leadId) {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'ekosolarize@gmail.com',
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const subject = `🌟 New Solar Lead: ${formData.name}${formData.electricBill ? ` ($${formData.electricBill}/mo)` : ''}`;
    
    const htmlContent = createAdminEmailHTML(formData, leadId);

    const mailOptions = {
      from: process.env.GMAIL_USER || 'ekosolarize@gmail.com',
      to: process.env.ADMIN_EMAIL || 'ekosolarize@gmail.com',
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      provider: 'nodemailer'
    };

  } catch (error) {
    console.error('❌ Admin notification failed:', error.message);
    
    // Fallback to Resend if nodemailer fails
    return sendViaResend({
      to: process.env.ADMIN_EMAIL || 'ekosolarize@gmail.com',
      subject: `🌟 New Solar Lead: ${formData.name}`,
      html: createAdminEmailHTML(formData, leadId)
    });
  }
}

// Simple welcome email
async function sendWelcomeEmail(formData) {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'ekosolarize@gmail.com',
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const subject = `Welcome to EkoSolarPros, ${formData.name}! Your Solar Journey Starts Here ⚡`;
    const htmlContent = createWelcomeEmailHTML(formData);

    const mailOptions = {
      from: process.env.GMAIL_USER || 'ekosolarize@gmail.com',
      to: formData.email,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      provider: 'nodemailer'
    };

  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
    
    // Fallback to Resend
    return sendViaResend({
      to: formData.email,
      subject: `Welcome to EkoSolarPros, ${formData.name}!`,
      html: createWelcomeEmailHTML(formData)
    });
  }
}

// Resend fallback function
async function sendViaResend({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('No Resend API key available');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EkoSolarPros <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Resend fallback successful: ${result.id}`);
    
    return {
      success: true,
      messageId: result.id,
      provider: 'resend'
    };
    
  } catch (error) {
    console.error('❌ Resend fallback failed:', error.message);
    throw error;
  }
}

// Create admin email HTML
function createAdminEmailHTML(formData, leadId) {
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8b500; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 12px; display: flex; }
        .label { font-weight: bold; min-width: 120px; color: #666; }
        .value { color: #333; }
        .cta { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f8b500; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">⚡ New Solar Lead - EkoSolarPros</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Received: ${timestamp}</p>
          <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.7;">Lead ID: ${leadId}</p>
        </div>
        
        <div class="content">
          <h3>Contact Information</h3>
          <div class="field"><span class="label">Name:</span><span class="value">${formData.name}</span></div>
          <div class="field"><span class="label">Email:</span><span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span></div>
          <div class="field"><span class="label">Phone:</span><span class="value"><a href="tel:${formData.phone}">${formData.phone}</a></span></div>
          ${formData.address ? `<div class="field"><span class="label">Address:</span><span class="value">${formData.address}</span></div>` : ''}
          
          <h3>Energy Information</h3>
          <div class="field"><span class="label">Monthly Bill:</span><span class="value">$${formData.electricBill || 'Not provided'}</span></div>
          
          ${formData.message ? `
          <h3>Customer Message</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0;">${formData.message}</p>
          </div>` : ''}
          
          <div class="cta">
            <h4 style="margin: 0 0 10px 0; color: #f8b500;">Quick Actions</h4>
            <p style="margin: 0;">
              <a href="mailto:${formData.email}?subject=Re: Your Solar Consultation Request&body=Hi ${formData.name},%0D%0A%0D%0AThank you for your interest in solar energy!%0D%0A%0D%0AWhen would be a good time for a brief call to discuss your solar options?%0D%0A%0D%0ABest regards,%0D%0AEkoSolarPros Team" 
                 style="background: #f8b500; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-right: 10px;">Reply via Email</a>
              <a href="tel:${formData.phone}" style="background: #28a745; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Call Customer</a>
            </p>
          </div>
          
          <div class="footer">
            <p>EkoSolarPros - Professional Solar Installation in Georgia<br>
            <a href="mailto:ekosolarize@gmail.com">ekosolarize@gmail.com</a> | <a href="tel:4045516532">(404) 551-6532</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Create welcome email HTML
function createWelcomeEmailHTML(formData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #f8b500; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .highlight { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f8b500; }
        .benefits { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .benefits ul { list-style: none; padding: 0; }
        .benefits li { padding: 8px 0; position: relative; padding-left: 20px; }
        .benefits li:before { content: "✓"; position: absolute; left: 0; color: #28a745; font-weight: bold; }
        .cta { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #f8b500; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">⚡ Welcome to EkoSolarPros!</h1>
          <p style="margin: 15px 0 0 0; opacity: 0.9;">Your Journey to Clean Energy Starts Here</p>
        </div>
        
        <div class="content">
          <h2>Hi ${formData.name},</h2>
          
          <p>Thank you for your interest in solar energy! We've received your consultation request and are excited to help you transition to clean, renewable energy.</p>
          
          <div class="highlight">
            <strong>What Happens Next?</strong><br>
            One of our solar experts will contact you within <strong>24-48 hours</strong> to:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Discuss your energy needs and goals</li>
              <li>Schedule your free consultation</li>
              <li>Answer any questions you may have</li>
            </ul>
          </div>
          
          <div class="benefits">
            <h3>While You Wait, Here's What Solar Can Do For You:</h3>
            <ul>
              <li>Reduce or eliminate your electric bills</li>
              <li>Increase your property value</li>
              <li>Earn tax credits and incentives</li>
              <li>Protect against rising energy costs</li>
              <li>Reduce your carbon footprint</li>
            </ul>
          </div>
          
          <h3>Your Submission Details:</h3>
          <p>We have your contact information and will reach out to:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0; padding-left: 20px; position: relative;">
              <span style="position: absolute; left: 0; color: #f8b500;">📧</span> Email: ${formData.email}
            </li>
            <li style="margin: 8px 0; padding-left: 20px; position: relative;">
              <span style="position: absolute; left: 0; color: #f8b500;">📞</span> Phone: ${formData.phone}
            </li>
            ${formData.electricBill ? `<li style="margin: 8px 0; padding-left: 20px; position: relative;">
              <span style="position: absolute; left: 0; color: #f8b500;">💡</span> Current Bill: $${formData.electricBill}/month
            </li>` : ''}
          </ul>
          
          <div class="cta">
            <p><strong>Have urgent questions?</strong></p>
            <a href="tel:4045516532" class="button">Call Us: (404) 551-6532</a>
          </div>
          
          <p>We look forward to helping you save money and the environment with solar energy!</p>
          
          <p>Best regards,<br><strong>The EkoSolarPros Team</strong></p>
        </div>
        
        <div class="footer">
          <p>EkoSolarPros - Solar Installation Georgia<br>
          <a href="mailto:ekosolarize@gmail.com" style="color: #f8b500;">ekosolarize@gmail.com</a> | 
          <a href="tel:4045516532" style="color: #f8b500;">(404) 551-6532</a></p>
          <p style="margin-top: 15px; opacity: 0.7;">
            © 2024 EkoSolarPros. All rights reserved.<br>
            <small>You received this email because you submitted a consultation request on our website.</small>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Rate limiting function
function checkRateLimit(clientIP) {
  const now = Date.now();
  
  // Clean up old entries
  for (const [ip, data] of submissionTracker.entries()) {
    if (now - data.firstSubmission > RATE_LIMIT_WINDOW) {
      submissionTracker.delete(ip);
    }
  }
  
  // Check current IP
  if (submissionTracker.has(clientIP)) {
    const data = submissionTracker.get(clientIP);
    if (data.count >= MAX_SUBMISSIONS_PER_WINDOW) {
      return false; // Rate limit exceeded
    }
    data.count++;
  } else {
    submissionTracker.set(clientIP, {
      firstSubmission: now,
      count: 1
    });
  }
  
  return true;
}

// Generate unique lead ID for tracking
function generateLeadId(formData) {
  const timestamp = Date.now();
  const emailHash = Buffer.from(formData.email).toString('base64').slice(0, 8);
  const random = Math.random().toString(36).substring(2, 8);
  return `lead_${timestamp}_${emailHash}_${random}`;
}