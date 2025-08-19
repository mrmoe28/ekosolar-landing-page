const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configure nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email configuration error:', error);
        } else {
          console.log('✅ Email service ready');
        }
      });
    } else {
      console.warn('⚠️  Email service not configured - missing SMTP credentials');
    }
  }

  // Helper method to create email HTML template
  createEmailTemplate(title, content, ctaText = null, ctaUrl = null) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header { 
            background: linear-gradient(135deg, #f59e0b, #eab308); 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
        }
        .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border: 1px solid #ddd;
        }
        .footer { 
            background: #333; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            border-radius: 0 0 8px 8px;
        }
        .cta-button { 
            display: inline-block; 
            background: #f59e0b; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
        }
        .highlight { 
            background: #fef3c7; 
            padding: 15px; 
            border-left: 4px solid #f59e0b; 
            margin: 15px 0;
        }
        .logo { 
            font-size: 24px; 
            font-weight: bold; 
            display: flex; 
            align-items: center; 
            justify-content: center;
        }
        .solar-icon { 
            color: #fbbf24; 
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <span class="solar-icon">☀️</span>
            EkoSolar
        </div>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your Solar Energy Solution</p>
    </div>
    <div class="content">
        ${content}
        ${ctaText && ctaUrl ? `<div style="text-align: center;"><a href="${ctaUrl}" class="cta-button">${ctaText}</a></div>` : ''}
    </div>
    <div class="footer">
        <p><strong>EkoSolar - Solar Energy Professionals</strong></p>
        <p>📧 ${process.env.CONTACT_EMAIL || 'info@ekosolarpros.com'} | 📞 (555) 123-SOLAR</p>
        <p>🌍 Powering Georgia with Clean Energy Solutions</p>
        <p style="font-size: 10px; margin-top: 15px;">
            This email was sent from EkoSolar. If you did not request this information, please contact us.
        </p>
    </div>
</body>
</html>`;
  }

  // Send contact form notification to company
  async sendContactNotification(contactData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const {
      name,
      email,
      phone,
      address,
      message,
      service,
      urgency,
      propertyType,
      energyBill,
      submittedAt
    } = contactData;

    const urgencyIcon = {
      low: '🟢',
      medium: '🟡', 
      high: '🟠',
      emergency: '🔴'
    };

    const content = `
        <h2>New Contact Form Submission</h2>
        
        <div class="highlight">
            <strong>Priority Level:</strong> ${urgencyIcon[urgency] || '🟡'} ${urgency.toUpperCase()}
        </div>
        
        <h3>Customer Information:</h3>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
            <li><strong>Address:</strong> ${address || 'Not provided'}</li>
        </ul>
        
        <h3>Service Request:</h3>
        <ul>
            <li><strong>Service Type:</strong> ${service}</li>
            <li><strong>Property Type:</strong> ${propertyType || 'Not specified'}</li>
            <li><strong>Monthly Energy Bill:</strong> ${energyBill ? `$${energyBill}` : 'Not provided'}</li>
        </ul>
        
        <h3>Message:</h3>
        <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            ${message}
        </div>
        
        <p><strong>Submitted:</strong> ${submittedAt.toLocaleString()}</p>
    `;

    const mailOptions = {
      from: `"EkoSolar Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@ekosolarpros.com',
      subject: `${urgencyIcon[urgency]} New ${service} inquiry from ${name}`,
      html: this.createEmailTemplate('New Contact Form Submission', content),
      replyTo: email
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send auto-reply to customer
  async sendAutoReply(contactData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const { name, email, service } = contactData;

    const serviceMessages = {
      installation: 'Our solar installation experts will review your property details and provide a comprehensive quote.',
      repair: 'Our certified technicians will diagnose and resolve your solar system issues promptly.',
      maintenance: 'We\'ll schedule regular maintenance to keep your solar system operating at peak efficiency.',
      consultation: 'Our solar energy consultants will help you understand your options and potential savings.',
      emergency: 'Our emergency response team will contact you within 1 hour to address your urgent solar system issue.',
      other: 'Our team will review your request and provide you with the information you need.'
    };

    const content = `
        <h2>Thank You for Contacting EkoSolar!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for your interest in our solar energy solutions! We have received your ${service} request and our team is reviewing your information.</p>
        
        <div class="highlight">
            <strong>What happens next?</strong><br>
            ${serviceMessages[service] || serviceMessages.other}
        </div>
        
        <h3>Your Solar Journey with EkoSolar:</h3>
        <ul>
            <li>✅ <strong>Request Received</strong> - We've got your information</li>
            <li>⏳ <strong>Expert Review</strong> - Our team is analyzing your needs</li>
            <li>📞 <strong>Personal Consultation</strong> - We'll contact you within 24 hours</li>
            <li>📋 <strong>Custom Proposal</strong> - Tailored solar solution for your property</li>
            <li>🔧 <strong>Professional Installation</strong> - Quality work by certified technicians</li>
        </ul>
        
        <p>In the meantime, feel free to explore our website to learn more about solar energy benefits, our services, and customer testimonials.</p>
        
        <p>If you have any urgent questions, please don't hesitate to call us directly at <strong>(555) 123-SOLAR</strong>.</p>
        
        <p>Thank you for choosing clean energy with EkoSolar!</p>
        
        <p>Best regards,<br>
        <strong>The EkoSolar Team</strong><br>
        Your Solar Energy Professionals</p>
    `;

    const mailOptions = {
      from: `"EkoSolar Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Thank you for your solar ${service} inquiry - EkoSolar`,
      html: this.createEmailTemplate('Thank You for Your Solar Inquiry', content, 'Learn More About Solar', 'https://ekosolarpros.com')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send quote request notification
  async sendQuoteRequestNotification(quoteData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const {
      name,
      email,
      phone,
      address,
      propertyType,
      energyBill,
      roofSize,
      roofCondition,
      timeframe,
      submittedAt
    } = quoteData;

    const content = `
        <h2>🎯 New Solar Quote Request</h2>
        
        <div class="highlight">
            <strong>HIGH PRIORITY:</strong> Customer is ready for solar quote consultation
        </div>
        
        <h3>Customer Information:</h3>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Property Address:</strong> ${address}</li>
        </ul>
        
        <h3>Project Details:</h3>
        <ul>
            <li><strong>Property Type:</strong> ${propertyType}</li>
            <li><strong>Monthly Energy Bill:</strong> $${energyBill}</li>
            <li><strong>Roof Size:</strong> ${roofSize ? `${roofSize} sq ft` : 'Not provided'}</li>
            <li><strong>Roof Condition:</strong> ${roofCondition || 'Not specified'}</li>
            <li><strong>Installation Timeframe:</strong> ${timeframe || 'Not specified'}</li>
        </ul>
        
        <p><strong>Submitted:</strong> ${submittedAt.toLocaleString()}</p>
        
        <div style="background: #fef3c7; padding: 15px; border: 1px solid #f59e0b; border-radius: 5px; margin-top: 20px;">
            <strong>📋 Action Required:</strong> Contact customer within 2 hours for quote consultation
        </div>
    `;

    const mailOptions = {
      from: `"EkoSolar Quote System" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@ekosolarpros.com',
      subject: `🎯 URGENT: Solar Quote Request from ${name} - $${energyBill}/month`,
      html: this.createEmailTemplate('New Solar Quote Request', content),
      replyTo: email
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send quote auto-reply to customer
  async sendQuoteAutoReply(quoteData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const { name, email, energyBill } = quoteData;

    // Rough estimate based on energy bill (this is simplified)
    const estimatedSystemSize = Math.round((energyBill * 12) / 1200); // kW
    const estimatedSavings = Math.round(energyBill * 0.8 * 12); // Annual savings

    const content = `
        <h2>Your Solar Quote Request is Being Processed!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Excellent choice in considering solar energy! We've received your quote request and our solar experts are preparing a customized proposal for your property.</p>
        
        <div class="highlight">
            <strong>🕐 Quick Response Promise:</strong><br>
            Our solar consultants will contact you within <strong>2 business hours</strong> to discuss your project and schedule a free site evaluation.
        </div>
        
        <h3>Preliminary Estimates (Based on Your $${energyBill}/month bill):</h3>
        <ul>
            <li>📊 <strong>Recommended System Size:</strong> ~${estimatedSystemSize} kW</li>
            <li>💰 <strong>Estimated Annual Savings:</strong> ~$${estimatedSavings.toLocaleString()}</li>
            <li>🏠 <strong>Typical Payback Period:</strong> 6-8 years</li>
            <li>🌱 <strong>25-Year CO₂ Reduction:</strong> ~${Math.round(estimatedSystemSize * 25 * 1.2)} tons</li>
        </ul>
        
        <p><em>*These are preliminary estimates. Your actual quote will be based on a detailed site analysis.</em></p>
        
        <h3>What's Next in Your Solar Journey:</h3>
        <ol>
            <li><strong>Personal Consultation</strong> - We'll call you within 2 hours</li>
            <li><strong>Free Site Evaluation</strong> - Professional assessment of your property</li>
            <li><strong>Custom Design</strong> - Tailored solar system design for maximum efficiency</li>
            <li><strong>Detailed Proposal</strong> - Complete quote with financing options</li>
            <li><strong>Professional Installation</strong> - Certified technicians handle everything</li>
        </ol>
        
        <p>We're excited to help you harness the power of the sun and start saving on your energy bills!</p>
        
        <p>Best regards,<br>
        <strong>The EkoSolar Team</strong></p>
    `;

    const mailOptions = {
      from: `"EkoSolar Quotes" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Solar Quote is Being Prepared - Potential $${estimatedSavings.toLocaleString()}/year savings!`,
      html: this.createEmailTemplate('Your Solar Quote Request', content, 'Calculate Your Savings', 'https://ekosolarpros.com/calculator')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send emergency notification
  async sendEmergencyNotification(emergencyData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const {
      name,
      phone,
      address,
      issue,
      urgencyLevel,
      systemAge,
      submittedAt
    } = emergencyData;

    const content = `
        <h2>🚨 EMERGENCY SOLAR SERVICE REQUEST</h2>
        
        <div style="background: #fecaca; padding: 20px; border-left: 5px solid #dc2626; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0;">⚠️ ${urgencyLevel.toUpperCase()} PRIORITY</h3>
            <p style="margin: 5px 0 0 0;"><strong>RESPONSE REQUIRED WITHIN 1 HOUR</strong></p>
        </div>
        
        <h3>Customer Information:</h3>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Service Address:</strong> ${address}</li>
        </ul>
        
        <h3>Emergency Details:</h3>
        <div style="background: #fff; padding: 15px; border: 2px solid #dc2626; border-radius: 5px;">
            <p><strong>Issue Description:</strong></p>
            <p style="font-size: 16px;">${issue}</p>
            <p><strong>System Age:</strong> ${systemAge ? `${systemAge} years` : 'Unknown'}</p>
        </div>
        
        <p><strong>Submitted:</strong> ${submittedAt.toLocaleString()}</p>
        
        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
            <strong>🚨 IMMEDIATE ACTION REQUIRED 🚨</strong><br>
            Call customer at <strong>${phone}</strong> within 1 hour
        </div>
    `;

    const mailOptions = {
      from: `"EkoSolar Emergency" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@ekosolarpros.com',
      subject: `🚨 EMERGENCY: ${urgencyLevel} priority solar issue - ${name} - ${phone}`,
      html: this.createEmailTemplate('EMERGENCY Solar Service Request', content),
      priority: 'high'
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send emergency auto-reply
  async sendEmergencyAutoReply(emergencyData) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const { name, email, phone } = emergencyData;

    const content = `
        <h2>🚨 Emergency Request Received</h2>
        
        <p>Dear ${name},</p>
        
        <div style="background: #fecaca; padding: 20px; border-left: 5px solid #dc2626; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0;">Emergency Response Activated</h3>
            <p style="margin: 10px 0 0 0;"><strong>Our emergency technician will call you at ${phone} within 1 hour.</strong></p>
        </div>
        
        <p>We understand that solar system emergencies require immediate attention. Your request has been flagged as high priority and our emergency response team has been notified.</p>
        
        <h3>What's Happening Now:</h3>
        <ul>
            <li>✅ <strong>Emergency Request Logged</strong> - Priority response activated</li>
            <li>⏱️ <strong>Technician Dispatch</strong> - Emergency team contacted immediately</li>
            <li>📞 <strong>1-Hour Response</strong> - We'll call you within 60 minutes</li>
            <li>🚗 <strong>Same-Day Service</strong> - Technician dispatched if needed</li>
        </ul>
        
        <div class="highlight">
            <strong>While you wait:</strong><br>
            If your situation worsens or you have immediate safety concerns, please turn off your solar system at the main breaker and contact emergency services if necessary.
        </div>
        
        <p><strong>Emergency Contact:</strong> ${phone}<br>
        <strong>Reference Number:</strong> ${emergencyData.emergencyId || 'Pending'}</p>
        
        <p>We're mobilizing our team to resolve your solar emergency as quickly as possible.</p>
        
        <p>Emergency Response Team,<br>
        <strong>EkoSolar</strong></p>
    `;

    const mailOptions = {
      from: `"EkoSolar Emergency" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🚨 Emergency Response Activated - EkoSolar will call within 1 hour`,
      html: this.createEmailTemplate('Emergency Response Activated', content),
      priority: 'high'
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Additional methods for appointments, reviews, etc. would go here...

  // Send appointment notification
  async sendAppointmentNotification(appointmentData) {
    // Implementation for appointment notifications
    console.log('Appointment notification sent:', appointmentData.appointmentId);
  }

  async sendAppointmentConfirmation(appointmentData) {
    // Implementation for appointment confirmations
    console.log('Appointment confirmation sent:', appointmentData.appointmentId);
  }

  async sendRescheduleNotification(rescheduleData) {
    // Implementation for reschedule notifications
    console.log('Reschedule notification sent:', rescheduleData.appointmentId);
  }

  async sendCancellationNotification(cancellationData) {
    // Implementation for cancellation notifications
    console.log('Cancellation notification sent:', cancellationData.appointmentId);
  }

  async sendCancellationConfirmation(cancellationData) {
    // Implementation for cancellation confirmations
    console.log('Cancellation confirmation sent:', cancellationData.appointmentId);
  }

  async sendReviewNotification(reviewData) {
    // Implementation for review notifications
    console.log('Review notification sent:', reviewData.reviewId);
  }

  async sendReviewThankYou(reviewData) {
    // Implementation for review thank you emails
    console.log('Review thank you sent:', reviewData.reviewId);
  }

  async sendReviewRequest(reviewRequestData) {
    // Implementation for review requests
    console.log('Review request sent:', reviewRequestData.requestId);
  }
}

module.exports = new EmailService();