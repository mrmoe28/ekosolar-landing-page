const EmailAnalyticsService = require('./email-analytics');
const LeadScoringService = require('./lead-scoring');

class EnhancedResendEmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'ekosolarize@gmail.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'ekosolarize@gmail.com';
    
    if (!this.apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    
    this.analytics = new EmailAnalyticsService();
    this.leadScoring = new LeadScoringService();
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

  // Enhanced admin notification with scoring and analytics
  async sendAdminNotification(formData) {
    // Generate unique lead ID
    const leadId = this.generateLeadId(formData);
    
    // Calculate lead score
    const scoring = this.leadScoring.calculateLeadScore(formData);
    
    // Generate enhanced subject with priority
    const priorityPrefix = scoring.priority === 'URGENT' ? '🚨 URGENT' : 
                          scoring.priority === 'HIGH' ? '🔥 HIGH PRIORITY' : 
                          scoring.priority === 'MEDIUM' ? '⭐ PRIORITY' : '';
    
    const subject = `${priorityPrefix} ${scoring.category} - ${formData.name} ($${formData.electricBill || '?'}/mo)`;
    
    // Create enhanced admin email HTML
    const html = this.createEnhancedAdminEmailHTML(formData, scoring, leadId);
    
    // Send email
    const result = await this.sendEmail({
      to: this.adminEmail,
      subject,
      html
    });
    
    // Store lead data for analytics (in production, use database)
    this.storeLeadData(leadId, formData, scoring);
    
    return result;
  }

  // Enhanced welcome email with tracking
  async sendWelcomeEmail(formData) {
    const leadId = this.generateLeadId(formData);
    const subject = 'Thank You for Your Solar Consultation Request - EkoSolarPros';
    
    // Create welcome email with tracking
    let html = this.createWelcomeEmailHTML(formData);
    html = this.analytics.enhanceWelcomeEmail(html, leadId);
    
    return this.sendEmail({
      to: formData.email,
      subject,
      html
    });
  }

  generateLeadId(formData) {
    const timestamp = Date.now();
    const nameSlug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `lead_${nameSlug}_${timestamp}`;
  }

  storeLeadData(leadId, formData, scoring) {
    // In production, store in database
    const leadData = {
      leadId,
      formData,
      scoring,
      timestamp: new Date(),
      source: 'website_form'
    };
    
    console.log(`💾 Stored lead data: ${leadId} (Score: ${scoring.total})`);
    // This would go to your database in production
  }

  createEnhancedAdminEmailHTML(formData, scoring, leadId) {
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Generate priority alert
    const priorityAlert = this.leadScoring.generatePriorityAlert(scoring);
    
    // Generate scoring breakdown
    const scoringBreakdown = this.leadScoring.generateScoringBreakdown(scoring);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EA580C, #DC2626); color: white; padding: 25px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 25px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; display: inline-block; min-width: 120px; }
          .value { margin-left: 10px; color: #333; }
          .actions { margin-top: 25px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #EA580C; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-right: 15px; 
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .button:hover { background: #DC2626; }
          .quick-stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
          }
          .stat-card { 
            background: white; 
            padding: 15px; 
            border-radius: 6px; 
            border-left: 4px solid #EA580C; 
            text-align: center; 
          }
          .stat-value { font-size: 24px; font-weight: bold; color: #EA580C; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🌟 New Solar Consultation Request</h2>
            <p style="margin: 5px 0 0 0;">Received: ${timestamp}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Lead ID: ${leadId}</p>
          </div>
          
          <div class="content">
            ${priorityAlert}
            
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-value">$${formData.electricBill || '?'}</div>
                <div class="stat-label">Monthly Bill</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${scoring.total}</div>
                <div class="stat-label">Lead Score</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${scoring.priority}</div>
                <div class="stat-label">Priority</div>
              </div>
            </div>
            
            <h3>👤 Contact Information:</h3>
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
            
            <h3>⚡ Energy Information:</h3>
            ${formData.electricBill ? `
            <div class="field">
              <span class="label">Monthly Bill:</span>
              <span class="value">$${formData.electricBill}</span>
            </div>` : '<p>No electric bill amount provided</p>'}
            
            ${formData.message ? `
            <h3>💬 Customer Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #EA580C;">
              <p style="margin: 0;">${formData.message}</p>
            </div>` : ''}
            
            ${scoringBreakdown}
            
            <div class="actions">
              <h3>🚀 Quick Actions:</h3>
              <a href="mailto:${formData.email}?subject=Re: Your Solar Consultation Request&body=Hi ${formData.name},%0D%0A%0D%0AThank you for your interest in solar energy! I'd love to discuss how we can help you save money with a custom solar solution.%0D%0A%0D%0ABased on your $${formData.electricBill || 'XX'}/month electric bill, you could potentially save significant money with solar.%0D%0A%0D%0AWhen would be a good time for a brief 15-minute call to discuss your options?%0D%0A%0D%0ABest regards,%0D%0AEkoSolarPros Team" 
                 class="button" style="color: white;">📧 Reply to Customer</a>
              <a href="tel:${formData.phone}" class="button" style="color: white;">📞 Call Customer</a>
              ${formData.address ? `<a href="https://www.google.com/maps/search/${encodeURIComponent(formData.address)}" target="_blank" class="button" style="color: white;">📍 View Location</a>` : ''}
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <div style="background: #E3F2FD; padding: 15px; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #1976D2;">📈 Follow-up Recommendations:</h4>
              ${this.generateFollowupRecommendations(scoring)}
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This enhanced notification includes AI-powered lead scoring and analytics. 
              Track engagement and responses for better conversion rates.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Add analytics tracking
    html = this.analytics.enhanceAdminNotification(html, leadId, formData);
    
    return html;
  }

  generateFollowupRecommendations(scoring) {
    let recommendations = [];
    
    if (scoring.priority === 'URGENT') {
      recommendations.push('📞 Call within 1 hour for maximum conversion potential');
      recommendations.push('📧 Send personalized follow-up email immediately');
    } else if (scoring.priority === 'HIGH') {
      recommendations.push('📞 Call within 4 hours');
      recommendations.push('📄 Prepare detailed proposal with savings calculator');
    } else {
      recommendations.push('📧 Send follow-up email within 24 hours');
      recommendations.push('📱 Add to nurture campaign for ongoing engagement');
    }
    
    if (scoring.electricBill >= 80) {
      recommendations.push('💰 Emphasize significant savings potential in communications');
    }
    
    if (scoring.location >= 40) {
      recommendations.push('🏘️ Mention premium system options suitable for their area');
    }
    
    return recommendations.map(rec => `<div style="margin: 5px 0;">• ${rec}</div>`).join('');
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

module.exports = EnhancedResendEmailService;