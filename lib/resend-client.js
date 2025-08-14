class ResendEmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'ekosolarize@gmail.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'ekosolarize@gmail.com';
    
    if (!this.apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
  }

  async sendEmail({ to, subject, html, text = null }) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `EkoSolarPros <${this.fromEmail}>`,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text: text || this.htmlToText(html)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${error.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result.id);
      return { success: true, messageId: result.id };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // Send notification to admin about new form submission
  async sendAdminNotification(formData) {
    const subject = `🌟 New Solar Consultation Request - ${formData.name}`;
    const html = this.createAdminEmailHTML(formData);
    
    return this.sendEmail({
      to: this.adminEmail,
      subject,
      html
    });
  }

  // Send welcome email to customer
  async sendWelcomeEmail(formData) {
    const subject = 'Thank You for Your Solar Consultation Request - EkoSolarPros';
    const html = this.createWelcomeEmailHTML(formData);
    
    return this.sendEmail({
      to: formData.email,
      subject,
      html
    });
  }

  createAdminEmailHTML(formData) {
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EA580C, #DC2626); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-left: 10px; color: #333; }
          .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
          .actions { margin-top: 20px; }
          .button { display: inline-block; padding: 10px 20px; background: #EA580C; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Solar Consultation Request</h2>
            <p style="margin: 0;">Received: ${timestamp}</p>
          </div>
          
          <div class="content">
            <div class="urgent">
              <strong>⚡ New Lead Alert!</strong> A potential customer has requested a solar consultation.
            </div>
            
            <h3>Contact Information:</h3>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${formData.name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value"><a href="tel:${formData.phone}">${formData.phone}</a></span>
            </div>
            ${formData.address ? `
            <div class="field">
              <span class="label">Address:</span>
              <span class="value">${formData.address}</span>
            </div>` : ''}
            
            <h3>Energy Information:</h3>
            ${formData.electricBill ? `
            <div class="field">
              <span class="label">Monthly Electric Bill:</span>
              <span class="value">$${formData.electricBill}</span>
            </div>` : '<p>No electric bill amount provided</p>'}
            
            ${formData.message ? `
            <h3>Additional Information:</h3>
            <div class="field">
              <p>${formData.message}</p>
            </div>` : ''}
            
            <div class="actions">
              <h3>Quick Actions:</h3>
              <a href="mailto:${formData.email}?subject=Re: Your Solar Consultation Request&body=Hi ${formData.name},%0D%0A%0D%0AThank you for your interest in solar energy!" class="button" style="color: white;">Reply to Customer</a>
              <a href="tel:${formData.phone}" class="button" style="color: white;">Call Customer</a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This is an automated notification from your website's contact form. 
              The customer has also received an automatic welcome email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  createWelcomeEmailHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #EA580C, #FCD34D); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 30px; background: white; }
          .highlight-box { background: #FFF7ED; border-left: 4px solid #EA580C; padding: 15px; margin: 20px 0; }
          .benefits { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .benefits ul { list-style: none; padding: 0; }
          .benefits li { padding: 8px 0; }
          .benefits li:before { content: "☀️ "; color: #EA580C; font-weight: bold; }
          .cta { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 15px 30px; background: #EA580C; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px; }
          .footer a { color: #EA580C; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EkoSolarPros!</h1>
            <p style="color: white; margin: 10px 0 0 0;">Your Journey to Clean Energy Starts Here</p>
          </div>
          
          <div class="content">
            <h2>Hi ${formData.name},</h2>
            
            <p>Thank you for your interest in solar energy! We've received your consultation request and are excited to help you transition to clean, renewable energy.</p>
            
            <div class="highlight-box">
              <strong>What Happens Next?</strong><br>
              One of our solar experts will contact you within <strong>24-48 hours</strong> to:
              <ul style="margin: 10px 0;">
                <li>• Discuss your energy needs and goals</li>
                <li>• Schedule your free consultation</li>
                <li>• Answer any questions you may have</li>
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
            <ul style="list-style: none; padding-left: 20px;">
              <li>📧 Email: ${formData.email}</li>
              <li>📱 Phone: ${formData.phone}</li>
              ${formData.electricBill ? `<li>💡 Current Bill: $${formData.electricBill}/month</li>` : ''}
            </ul>
            
            <div class="cta">
              <p><strong>Have urgent questions?</strong></p>
              <a href="tel:4045516532" class="button" style="color: white;">Call Us: (404) 551-6532</a>
            </div>
            
            <p>We look forward to helping you save money and the environment with solar energy!</p>
            
            <p>Best regards,<br>
            <strong>The EkoSolarPros Team</strong></p>
          </div>
          
          <div class="footer">
            <p>EkoSolarPros - Solar Installation Georgia<br>
            123 Solar Street, Stone Mountain, GA 30083<br>
            <a href="mailto:ekosolarize@gmail.com">ekosolarize@gmail.com</a> | <a href="tel:4045516532">(404) 551-6532</a></p>
            <p style="margin-top: 15px;">
              © 2024 EkoSolarPros. All rights reserved.<br>
              <small>You received this email because you submitted a consultation request on our website.</small>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = ResendEmailService;