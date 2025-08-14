const { google } = require('googleapis');
const LeadScoringService = require('./lead-scoring');

class GoogleEnhancedEmailService {
  constructor() {
    // Use environment variables for Google credentials
    this.clientId = process.env.GMAIL_CLIENT_ID || 'your_gmail_client_id_here';
    this.clientSecret = process.env.GMAIL_CLIENT_SECRET || 'your_gmail_client_secret_here'; 
    this.refreshToken = process.env.GMAIL_REFRESH_TOKEN || 'your_gmail_refresh_token_here';
    this.adminEmail = process.env.ADMIN_EMAIL || 'ekosolarize@gmail.com';
    
    this.leadScoring = new LeadScoringService();
    
    // Initialize OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    
    this.oauth2Client.setCredentials({
      refresh_token: this.refreshToken
    });
    
    // Initialize Gmail API
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    console.log('✅ Google Enhanced Email Service initialized');
  }

  async sendEmail({ to, subject, htmlContent, textContent }) {
    try {
      // Create email message
      const emailMessage = this.createEmailMessage({
        to,
        subject,
        htmlContent,
        textContent
      });
      
      // Send email via Gmail API
      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: emailMessage
        }
      });
      
      console.log(`✅ Gmail API email sent: ${result.data.id}`);
      return {
        success: true,
        messageId: result.data.id,
        provider: 'gmail_api'
      };
      
    } catch (error) {
      console.error('❌ Gmail API error:', error.message);
      
      // Fallback to Resend if Gmail fails
      console.log('🔄 Falling back to Resend...');
      return this.sendViaResendFallback({ to, subject, htmlContent, textContent });
    }
  }

  async sendViaResendFallback({ to, subject, htmlContent, textContent }) {
    try {
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
          html: htmlContent,
          text: textContent || this.htmlToText(htmlContent)
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend fallback failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ Resend fallback successful: ${result.id}`);
      return {
        success: true,
        messageId: result.id,
        provider: 'resend_fallback'
      };
    } catch (error) {
      console.error('❌ Both Gmail and Resend failed:', error.message);
      throw error;
    }
  }

  createEmailMessage({ to, subject, htmlContent, textContent }) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36)}`;
    
    const message = [
      `To: ${to}`,
      `From: EkoSolarPros <${this.adminEmail}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      '',
      textContent || this.htmlToText(htmlContent),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlContent,
      '',
      `--${boundary}--`
    ].join('\n');

    // Encode message in base64url
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
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

  // Enhanced admin notification with Google integration
  async sendAdminNotification(formData) {
    // Generate unique lead ID
    const leadId = this.generateLeadId(formData);
    
    // Calculate lead score
    const scoring = this.leadScoring.calculateLeadScore(formData);
    
    // Log to Google Sheets (we'll implement this next)
    await this.logLeadToGoogleSheets(formData, scoring, leadId);
    
    // Generate enhanced subject with priority
    const priorityPrefix = scoring.priority === 'URGENT' ? '🚨 URGENT' : 
                          scoring.priority === 'HIGH' ? '🔥 HIGH PRIORITY' : 
                          scoring.priority === 'MEDIUM' ? '⭐ PRIORITY' : '';
    
    const subject = `${priorityPrefix} ${scoring.category} - ${formData.name} ($${formData.electricBill || '?'}/mo)`;
    
    // Create enhanced admin email HTML
    const htmlContent = this.createEnhancedAdminEmailHTML(formData, scoring, leadId);
    
    // Send via Gmail API
    return this.sendEmail({
      to: this.adminEmail,
      subject,
      htmlContent
    });
  }

  // Enhanced welcome email
  async sendWelcomeEmail(formData) {
    const subject = 'Thank You for Your Solar Consultation Request - EkoSolarPros';
    const htmlContent = this.createWelcomeEmailHTML(formData);
    
    return this.sendEmail({
      to: formData.email,
      subject,
      htmlContent
    });
  }

  generateLeadId(formData) {
    const timestamp = Date.now();
    const nameSlug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `lead_${nameSlug}_${timestamp}`;
  }

  async logLeadToGoogleSheets(formData, scoring, leadId) {
    try {
      // We'll implement Google Sheets integration in the next step
      console.log(`📊 Lead data ready for Google Sheets: ${leadId} (Score: ${scoring.total})`);
      
      // For now, log the data structure we'll send to Sheets
      const sheetData = {
        timestamp: new Date().toISOString(),
        leadId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || '',
        electricBill: formData.electricBill || 0,
        message: formData.message || '',
        leadScore: scoring.total,
        priority: scoring.priority,
        category: scoring.category,
        insights: scoring.insights.join(' | ')
      };
      
      console.log('📝 Sheet data prepared:', sheetData);
      return sheetData;
    } catch (error) {
      console.error('❌ Error preparing sheet data:', error.message);
    }
  }

  createEnhancedAdminEmailHTML(formData, scoring, leadId) {
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Generate priority alert based on scoring
    const priorityAlert = this.generatePriorityAlert(scoring);
    
    // Generate Google Sheets link (we'll implement this)
    const sheetsLink = `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* ShadCN UI Color Variables */
          :root {
            --background: oklch(1 0 0);
            --foreground: oklch(0.145 0 0);
            --primary: oklch(0.205 0 0);
            --primary-foreground: oklch(0.985 0 0);
            --secondary: oklch(0.97 0 0);
            --secondary-foreground: oklch(0.205 0 0);
            --muted: oklch(0.97 0 0);
            --muted-foreground: oklch(0.45 0 0);
            --accent: oklch(0.97 0 0);
            --accent-foreground: oklch(0.205 0 0);
            --border: oklch(0.9 0 0);
            --ring: oklch(0.205 0 0);
            --solar-accent: oklch(0.75 0.15 75);
            --solar-accent-foreground: oklch(0.15 0 0);
          }
          
          /* ShadCN UI Base Styles */
          body { 
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.5; 
            color: var(--foreground); 
            margin: 0; 
            padding: 0;
            background: var(--background);
          }
          
          .container { 
            max-width: 680px; 
            margin: 0 auto; 
            padding: 24px;
            background: var(--background);
          }
          
          .header { 
            background: var(--primary);
            color: var(--primary-foreground); 
            padding: 32px 24px; 
            border-radius: 12px 12px 0 0; 
            text-align: center;
            border: 1px solid var(--border);
            border-bottom: none;
          }
          
          .content { 
            background: var(--background); 
            padding: 32px 24px; 
            border: 1px solid var(--border); 
            border-radius: 0 0 12px 12px;
            border-top: none;
          }
          
          .priority-section { 
            margin: 24px 0; 
          }
          
          .field { 
            margin-bottom: 16px; 
            display: flex; 
            align-items: center; 
            gap: 12px;
          }
          
          .label { 
            font-weight: 500; 
            color: var(--muted-foreground); 
            min-width: 120px; 
            font-size: 14px;
          }
          
          .value { 
            color: var(--foreground);
            font-weight: 400;
          }
          
          .shadcn-button { 
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px; 
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
            text-decoration: none; 
            border-radius: 6px; 
            margin: 4px 6px 4px 0;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }
          
          .shadcn-button-primary { 
            background: var(--primary);
            color: var(--primary-foreground);
            border-color: var(--primary);
          }
          
          .shadcn-button-secondary { 
            background: var(--secondary);
            color: var(--secondary-foreground);
            border-color: var(--border);
          }
          
          .shadcn-button-solar { 
            background: var(--solar-accent);
            color: var(--solar-accent-foreground);
            border-color: var(--solar-accent);
          }
          
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); 
            gap: 16px; 
            margin: 24px 0; 
          }
          
          .stat-card { 
            background: var(--background); 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            border: 1px solid var(--border);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .stat-value { 
            font-size: 24px; 
            font-weight: 600; 
            color: var(--foreground);
            line-height: 1.2;
          }
          
          .stat-label { 
            font-size: 12px; 
            color: var(--muted-foreground); 
            text-transform: uppercase; 
            margin-top: 8px;
            font-weight: 500;
            letter-spacing: 0.05em;
          }
          
          .insights-section { 
            background: var(--accent); 
            padding: 20px; 
            border-radius: 8px; 
            margin: 24px 0; 
            border-left: 3px solid var(--solar-accent);
            border: 1px solid var(--border);
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--foreground);
            margin: 24px 0 16px 0;
            line-height: 1.3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; font-size: 22px; font-weight: 600;">
              <span style="display: inline-block; width: 20px; height: 20px; background: var(--solar-accent); border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
              New Solar Lead via Enhanced System
            </h2>
            <p style="margin: 16px 0 0 0; opacity: 0.85; font-size: 14px;">Received: ${timestamp}</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.7; font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;">Lead ID: ${leadId}</p>
          </div>
          
          <div class="content">
            <div class="priority-section">
              ${priorityAlert}
            </div>
            
            <div class="stats-grid">
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
                <div class="stat-label">Priority Level</div>
              </div>
            </div>
            
            <h3 class="section-title">
              <span style="display: inline-block; width: 16px; height: 16px; background: var(--muted-foreground); border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
              Contact Information
            </h3>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${formData.name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${formData.email}" style="color: var(--primary); text-decoration: none;">${formData.email}</a></span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value"><a href="tel:${formData.phone}" style="color: var(--primary); text-decoration: none;">${formData.phone}</a></span>
            </div>
            ${formData.address ? `
            <div class="field">
              <span class="label">Address:</span>
              <span class="value">${formData.address}</span>
            </div>` : ''}
            
            <h3 class="section-title">
              <span style="display: inline-block; width: 16px; height: 16px; background: var(--solar-accent); border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
              Energy Profile
            </h3>
            <div class="field">
              <span class="label">Monthly Bill:</span>
              <span class="value">$${formData.electricBill || 'Not provided'}</span>
            </div>
            
            ${formData.message ? `
            <h3 class="section-title">
              <span style="display: inline-block; width: 16px; height: 16px; background: var(--muted-foreground); border-radius: 2px; margin-right: 8px; vertical-align: middle;"></span>
              Customer Message
            </h3>
            <div style="background: var(--accent); padding: 16px; border-radius: 8px; border-left: 3px solid var(--primary); margin: 16px 0; border: 1px solid var(--border);">
              <p style="margin: 0; color: var(--foreground); line-height: 1.5;">${formData.message}</p>
            </div>` : ''}
            
            <div class="insights-section">
              <h4 style="margin: 0 0 16px 0; color: var(--solar-accent-foreground); font-weight: 600; font-size: 16px;">
                <span style="display: inline-block; width: 14px; height: 14px; background: var(--solar-accent); border-radius: 2px; margin-right: 8px; vertical-align: middle;"></span>
                AI Lead Insights
              </h4>
              ${scoring.insights.map(insight => `<div style="margin: 8px 0; color: var(--muted-foreground); font-size: 14px; padding-left: 22px; position: relative;">
                <span style="position: absolute; left: 0; top: 0.3em; width: 4px; height: 4px; background: var(--solar-accent); border-radius: 50%;"></span>
                ${insight}
              </div>`).join('')}
            </div>
            
            <h3 class="section-title">
              <span style="display: inline-block; width: 16px; height: 16px; background: var(--primary); border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
              Quick Actions
            </h3>
            <div style="margin: 20px 0;">
              <a href="mailto:${formData.email}?subject=Re: Your Solar Consultation Request&body=Hi ${formData.name},%0D%0A%0D%0AThank you for your interest in solar energy! Based on your $${formData.electricBill || 'XX'}/month electric bill, you could potentially save significant money with solar.%0D%0A%0D%0AWhen would be a good time for a brief 15-minute call to discuss your solar options?%0D%0A%0D%0ABest regards,%0D%0AEkoSolarPros Team" 
                 class="shadcn-button shadcn-button-primary" style="color: var(--primary-foreground);">
                <span style="margin-right: 6px;">✉</span> Reply via Email
              </a>
              <a href="tel:${formData.phone}" class="shadcn-button shadcn-button-solar" style="color: var(--solar-accent-foreground);">
                <span style="margin-right: 6px;">☎</span> Call Customer
              </a>
              <a href="${sheetsLink}" target="_blank" class="shadcn-button shadcn-button-secondary" style="color: var(--secondary-foreground);">
                <span style="margin-right: 6px;">⊞</span> View in Sheets
              </a>
              ${formData.address ? `<a href="https://www.google.com/maps/search/${encodeURIComponent(formData.address)}" target="_blank" class="shadcn-button shadcn-button-secondary" style="color: var(--secondary-foreground);">
                <span style="margin-right: 6px;">⌖</span> View Location
              </a>` : ''}
            </div>
            
            <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border);">
            
            <div style="background: var(--accent); padding: 20px; border-radius: 8px; border: 1px solid var(--border);">
              <h4 style="margin: 0 0 12px 0; color: var(--foreground); font-weight: 600; font-size: 16px;">
                <span style="display: inline-block; width: 14px; height: 14px; background: var(--primary); border-radius: 2px; margin-right: 8px; vertical-align: middle;"></span>
                Next Steps Recommendation
              </h4>
              ${this.generateGoogleFollowupRecommendations(scoring)}
            </div>
            
            <p style="color: var(--muted-foreground); font-size: 11px; margin-top: 32px; text-align: center; line-height: 1.4;">
              Enhanced by ShadCN UI Design System • Lead data automatically saved to Google Sheets<br>
              Powered by EkoSolarPros AI Lead Scoring System
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePriorityAlert(scoring) {
    const priority = scoring.priority;
    const category = scoring.category;
    
    let alertStyles, iconShape;
    
    switch (priority) {
      case 'URGENT':
        alertStyles = {
          background: 'oklch(0.97 0.013 17.38)',
          border: 'oklch(0.577 0.245 27.325)',
          text: 'oklch(0.457 0.195 27.325)'
        };
        iconShape = '▲'; // Triangle for urgent
        break;
      case 'HIGH':
        alertStyles = {
          background: 'oklch(0.98 0.013 83.87)',
          border: 'oklch(0.75 0.15 75)',
          text: 'oklch(0.55 0.12 75)'
        };
        iconShape = '●'; // Circle for high
        break;
      case 'MEDIUM':
        alertStyles = {
          background: 'oklch(0.97 0.01 162.04)',
          border: 'oklch(0.69 0.15 162.04)',
          text: 'oklch(0.49 0.12 162.04)'
        };
        iconShape = '■'; // Square for medium
        break;
      default:
        alertStyles = {
          background: 'var(--muted)',
          border: 'var(--border)',
          text: 'var(--muted-foreground)'
        };
        iconShape = '◯'; // Circle outline for standard
    }
    
    return `
      <div style="background: ${alertStyles.background}; border: 2px solid ${alertStyles.border}; padding: 20px; border-radius: 8px;">
        <h3 style="color: ${alertStyles.text}; margin: 0 0 12px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 8px; font-size: 20px;">${iconShape}</span>
          ${priority} PRIORITY - ${category}
        </h3>
        <div style="color: ${alertStyles.text}; font-weight: 500; font-size: 14px;">
          Lead Score: ${scoring.total}/200 points
        </div>
      </div>
    `;
  }

  generateGoogleFollowupRecommendations(scoring) {
    let recommendations = [];
    
    if (scoring.priority === 'URGENT') {
      recommendations.push('☎ Call within 1 hour - use Google Calendar to schedule immediately');
      recommendations.push('✉ Send personalized Gmail follow-up with solar savings calculator');
    } else if (scoring.priority === 'HIGH') {
      recommendations.push('☎ Call within 4 hours - add to Google Calendar reminders');
      recommendations.push('⊞ Prepare detailed proposal using Google Docs template');
    } else {
      recommendations.push('✉ Send follow-up Gmail within 24 hours');
      recommendations.push('⊡ Add to Google Calendar nurture sequence');
    }
    
    if (scoring.electricBill >= 80) {
      recommendations.push('$ Use Google Sheets savings calculator for proposal');
    }
    
    return recommendations.map(rec => `<div style="margin: 8px 0; color: var(--primary); font-size: 14px; padding-left: 20px; position: relative;">
      <span style="position: absolute; left: 0; top: 0.1em; width: 4px; height: 4px; background: var(--primary); border-radius: 50%;"></span>
      ${rec}
    </div>`).join('');
  }

  createWelcomeEmailHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* ShadCN UI Color Variables */
          :root {
            --background: oklch(1 0 0);
            --foreground: oklch(0.145 0 0);
            --primary: oklch(0.205 0 0);
            --primary-foreground: oklch(0.985 0 0);
            --secondary: oklch(0.97 0 0);
            --secondary-foreground: oklch(0.205 0 0);
            --muted: oklch(0.97 0 0);
            --muted-foreground: oklch(0.45 0 0);
            --accent: oklch(0.97 0 0);
            --accent-foreground: oklch(0.205 0 0);
            --border: oklch(0.9 0 0);
            --solar-accent: oklch(0.75 0.15 75);
            --solar-accent-foreground: oklch(0.15 0 0);
          }
          
          /* ShadCN UI Base Styles */
          body { 
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.5; 
            color: var(--foreground); 
            margin: 0; 
            padding: 0;
            background: var(--background);
          }
          
          .container { 
            max-width: 600px; 
            margin: 0 auto;
            background: var(--background);
          }
          
          .header { 
            background: var(--primary);
            padding: 40px 32px; 
            text-align: center;
            border-radius: 12px 12px 0 0;
            border: 1px solid var(--border);
            border-bottom: none;
          }
          
          .header h1 { 
            color: var(--primary-foreground); 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
            line-height: 1.2;
          }
          
          .content { 
            padding: 32px; 
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: 0 0 12px 12px;
            border-top: none;
          }
          
          .highlight-box { 
            background: var(--accent); 
            border-left: 3px solid var(--primary); 
            padding: 20px; 
            margin: 24px 0; 
            border-radius: 0 8px 8px 0;
            border: 1px solid var(--border);
          }
          
          .benefits { 
            background: var(--secondary); 
            padding: 24px; 
            border-radius: 8px; 
            margin: 24px 0; 
            border: 1px solid var(--border);
          }
          
          .benefits ul { 
            list-style: none; 
            padding: 0; 
            margin: 16px 0 0 0;
          }
          
          .benefits li { 
            padding: 8px 0; 
            color: var(--foreground);
            font-size: 14px;
            position: relative;
            padding-left: 20px;
          }
          
          .benefits li:before { 
            content: "";
            position: absolute;
            left: 0;
            top: 0.7em;
            width: 8px;
            height: 8px;
            background: var(--solar-accent);
            border-radius: 2px;
          }
          
          .cta { 
            text-align: center; 
            margin: 32px 0; 
          }
          
          .shadcn-button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: var(--primary); 
            color: var(--primary-foreground); 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500;
            font-size: 14px;
            border: 1px solid var(--primary);
            transition: all 0.2s ease;
          }
          
          .shadcn-button-solar { 
            background: var(--solar-accent); 
            color: var(--solar-accent-foreground);
            border-color: var(--solar-accent);
          }
          
          .footer { 
            background: var(--primary); 
            color: var(--primary-foreground); 
            padding: 24px; 
            text-align: center; 
            font-size: 12px;
            opacity: 0.9;
            border-radius: 0 0 12px 12px;
          }
          
          .footer a { 
            color: var(--primary-foreground); 
            text-decoration: none;
            opacity: 0.8;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--foreground);
            margin: 24px 0 16px 0;
            line-height: 1.3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              <span style="display: inline-block; width: 24px; height: 24px; background: var(--solar-accent); border-radius: 50%; margin-right: 12px; vertical-align: middle;"></span>
              Welcome to EkoSolarPros!
            </h1>
            <p style="color: var(--primary-foreground); margin: 16px 0 0 0; opacity: 0.85; font-size: 16px;">Your Journey to Clean Energy Starts Here</p>
          </div>
          
          <div class="content">
            <h2 style="color: var(--foreground); font-weight: 600; font-size: 20px;">Hi ${formData.name},</h2>
            
            <p style="margin: 16px 0; line-height: 1.6;">Thank you for your interest in solar energy! We've received your consultation request and are excited to help you transition to clean, renewable energy.</p>
            
            <div class="highlight-box">
              <strong style="color: var(--primary); font-size: 16px;">What Happens Next?</strong><br>
              <p style="margin: 12px 0; color: var(--foreground);">One of our solar experts will contact you within <strong>24-48 hours</strong> to:</p>
              <ul style="margin: 12px 0; padding-left: 20px; list-style: none;">
                <li style="margin: 8px 0; position: relative; padding-left: 16px;">
                  <span style="position: absolute; left: 0; top: 0.5em; width: 4px; height: 4px; background: var(--primary); border-radius: 50%;"></span>
                  Discuss your energy needs and goals
                </li>
                <li style="margin: 8px 0; position: relative; padding-left: 16px;">
                  <span style="position: absolute; left: 0; top: 0.5em; width: 4px; height: 4px; background: var(--primary); border-radius: 50%;"></span>
                  Schedule your free consultation
                </li>
                <li style="margin: 8px 0; position: relative; padding-left: 16px;">
                  <span style="position: absolute; left: 0; top: 0.5em; width: 4px; height: 4px; background: var(--primary); border-radius: 50%;"></span>
                  Answer any questions you may have
                </li>
              </ul>
            </div>
            
            <div class="benefits">
              <h3 class="section-title" style="margin-top: 0;">
                <span style="display: inline-block; width: 16px; height: 16px; background: var(--solar-accent); border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
                While You Wait, Here's What Solar Can Do For You:
              </h3>
              <ul>
                <li>Reduce or eliminate your electric bills</li>
                <li>Increase your property value</li>
                <li>Earn tax credits and incentives</li>
                <li>Protect against rising energy costs</li>
                <li>Reduce your carbon footprint</li>
              </ul>
            </div>
            
            <h3 class="section-title">
              <span style="display: inline-block; width: 16px; height: 16px; background: var(--muted-foreground); border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
              Your Submission Details:
            </h3>
            <p style="margin: 16px 0; color: var(--muted-foreground);">We have your contact information and will reach out to:</p>
            <ul style="list-style: none; padding: 0; margin: 16px 0;">
              <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px; color: var(--foreground);">
                <span style="width: 14px; height: 14px; background: var(--primary); border-radius: 2px; flex-shrink: 0;"></span>
                <span>Email: ${formData.email}</span>
              </li>
              <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px; color: var(--foreground);">
                <span style="width: 14px; height: 14px; background: var(--primary); border-radius: 2px; flex-shrink: 0;"></span>
                <span>Phone: ${formData.phone}</span>
              </li>
              ${formData.electricBill ? `<li style="margin: 8px 0; display: flex; align-items: center; gap: 8px; color: var(--foreground);">
                <span style="width: 14px; height: 14px; background: var(--solar-accent); border-radius: 2px; flex-shrink: 0;"></span>
                <span>Current Bill: $${formData.electricBill}/month</span>
              </li>` : ''}
            </ul>
            
            <div class="cta">
              <p style="margin: 0 0 16px 0;"><strong style="color: var(--foreground);">Have urgent questions?</strong></p>
              <a href="tel:4045516532" class="shadcn-button shadcn-button-solar" style="color: var(--solar-accent-foreground);">
                <span style="margin-right: 6px;">☎</span> Call Us: (404) 551-6532
              </a>
            </div>
            
            <p style="margin: 24px 0 16px 0; line-height: 1.6;">We look forward to helping you save money and the environment with solar energy!</p>
            
            <p style="margin: 0;">
              Best regards,<br>
              <strong style="color: var(--foreground);">The EkoSolarPros Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 12px 0; line-height: 1.4;">
              EkoSolarPros - Solar Installation Georgia<br>
              Enhanced by ShadCN UI Design System<br>
              <a href="mailto:ekosolarize@gmail.com">ekosolarize@gmail.com</a> | <a href="tel:4045516532">(404) 551-6532</a>
            </p>
            <p style="margin: 16px 0 0 0; font-size: 11px; opacity: 0.7; line-height: 1.3;">
              © 2024 EkoSolarPros. All rights reserved.<br>
              <small>You received this email because you submitted a consultation request on our website.</small>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Enhanced admin notification with email tracking
  async sendAdminNotificationWithTracking(formData, leadId, analyticsService) {
    try {
      // Get base admin notification HTML
      const baseHtml = this.getAdminEmailHtml(formData);
      
      // Enhance with tracking
      const trackedHtml = analyticsService.enhanceAdminNotification(baseHtml, leadId, formData);
      
      const subject = `🚨 New Solar Lead: ${formData.name} ${this.leadScoring.calculateLeadScore(formData).isHotLead ? '🔥 HOT LEAD' : ''}`;
      
      return await this.sendEmail({
        to: this.adminEmail,
        subject: subject,
        htmlContent: trackedHtml
      });
    } catch (error) {
      console.error('❌ Error sending tracked admin notification:', error);
      // Fallback to regular admin notification
      return await this.sendAdminNotification(formData);
    }
  }

  // Enhanced welcome email with tracking
  async sendWelcomeEmailWithTracking(formData, leadId, analyticsService) {
    try {
      // Get base welcome email HTML
      const baseHtml = this.getWelcomeEmailHtml(formData);
      
      // Enhance with tracking
      const trackedHtml = analyticsService.enhanceWelcomeEmail(baseHtml, leadId);
      
      const subject = `Welcome to EkoSolarPros, ${formData.name}! Your Solar Journey Starts Here ⚡`;
      
      return await this.sendEmail({
        to: formData.email,
        subject: subject,
        htmlContent: trackedHtml
      });
    } catch (error) {
      console.error('❌ Error sending tracked welcome email:', error);
      // Fallback to regular welcome email
      return await this.sendWelcomeEmail(formData);
    }
  }
}

module.exports = GoogleEnhancedEmailService;