// Email analytics and tracking service for EkoSolar leads
class EmailAnalyticsService {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://ekosolarpros.com';
    this.analytics = new Map(); // In production, use a database
  }

  // Generate tracking pixel for email opens
  generateTrackingPixel(leadId, emailType) {
    const trackingId = this.generateTrackingId(leadId, emailType);
    return `<img src="${this.baseUrl}/api/track-email-open?id=${trackingId}" width="1" height="1" style="display:none;" alt="">`;
  }

  // Generate trackable link
  generateTrackableLink(originalUrl, leadId, linkName) {
    const trackingId = this.generateTrackingId(leadId, 'link');
    const encodedUrl = encodeURIComponent(originalUrl);
    return `${this.baseUrl}/api/track-link-click?id=${trackingId}&url=${encodedUrl}&link=${linkName}`;
  }

  // Generate unique tracking ID
  generateTrackingId(leadId, type) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${type}_${leadId}_${timestamp}_${random}`;
  }

  // Record email open
  recordEmailOpen(trackingId, userAgent, ipAddress) {
    const record = {
      trackingId,
      type: 'email_open',
      timestamp: new Date(),
      userAgent,
      ipAddress,
      leadInfo: this.parseTrackingId(trackingId)
    };

    this.analytics.set(`open_${trackingId}`, record);
    console.log(`📧 Email opened: ${trackingId}`);
    
    // In production, save to database and trigger alerts
    this.triggerHotLeadAlert(record);
    
    return record;
  }

  // Record link click
  recordLinkClick(trackingId, userAgent, ipAddress, linkName) {
    const record = {
      trackingId,
      type: 'link_click',
      linkName,
      timestamp: new Date(),
      userAgent,
      ipAddress,
      leadInfo: this.parseTrackingId(trackingId)
    };

    this.analytics.set(`click_${trackingId}`, record);
    console.log(`🔗 Link clicked: ${linkName} by ${trackingId}`);
    
    // In production, save to database and trigger alerts
    this.triggerEngagementAlert(record);
    
    return record;
  }

  // Parse tracking ID to extract lead info
  parseTrackingId(trackingId) {
    const parts = trackingId.split('_');
    return {
      type: parts[0],
      leadId: parts[1],
      timestamp: parts[2],
      random: parts[3]
    };
  }

  // Trigger hot lead alert when email is opened
  triggerHotLeadAlert(record) {
    // This could send a priority notification
    console.log(`🔥 HOT LEAD ALERT: Lead ${record.leadInfo.leadId} opened email!`);
    
    // Could trigger:
    // - Priority push notification
    // - Slack/Teams alert
    // - SMS to sales team
    // - Update CRM with engagement score
  }

  // Trigger engagement alert when links are clicked
  triggerEngagementAlert(record) {
    console.log(`⚡ ENGAGEMENT ALERT: Lead ${record.leadInfo.leadId} clicked ${record.linkName}!`);
    
    // Could trigger:
    // - Follow-up email sequence
    // - Sales team notification
    // - Lead scoring update
    // - Calendar booking reminder
  }

  // Get analytics for a lead
  getLeadAnalytics(leadId) {
    const analytics = [];
    
    for (const [key, record] of this.analytics) {
      if (record.leadInfo && record.leadInfo.leadId === leadId) {
        analytics.push(record);
      }
    }
    
    return analytics.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get engagement summary
  getEngagementSummary(leadId) {
    const analytics = this.getLeadAnalytics(leadId);
    
    const opens = analytics.filter(a => a.type === 'email_open').length;
    const clicks = analytics.filter(a => a.type === 'link_click').length;
    const lastActivity = analytics.length > 0 ? analytics[0].timestamp : null;
    
    // Calculate engagement score
    let score = 0;
    score += opens * 10; // 10 points per open
    score += clicks * 25; // 25 points per click
    
    // Recency bonus
    if (lastActivity) {
      const hoursSinceActivity = (Date.now() - new Date(lastActivity)) / (1000 * 60 * 60);
      if (hoursSinceActivity < 1) score += 50; // Very recent activity
      else if (hoursSinceActivity < 24) score += 25; // Recent activity
    }

    return {
      leadId,
      engagementScore: score,
      emailOpens: opens,
      linkClicks: clicks,
      lastActivity,
      isHotLead: score > 50,
      summary: this.generateEngagementSummary(score, opens, clicks)
    };
  }

  generateEngagementSummary(score, opens, clicks) {
    if (score > 75) return '🔥 Hot Lead - High Engagement';
    if (score > 50) return '⚡ Warm Lead - Moderate Engagement';
    if (score > 25) return '👀 Interested - Some Engagement';
    if (score > 0) return '📧 Aware - Basic Engagement';
    return '😴 Cold - No Engagement';
  }

  // Enhanced admin notification with engagement data
  enhanceAdminNotification(originalHtml, leadId, formData) {
    // Add engagement tracking pixel
    const trackingPixel = this.generateTrackingPixel(leadId, 'admin');
    
    // Add trackable links
    const phoneTrackable = this.generateTrackableLink(`tel:${formData.phone}`, leadId, 'phone_call');
    const emailTrackable = this.generateTrackableLink(`mailto:${formData.email}`, leadId, 'email_reply');
    
    // Get any existing engagement data (for returning leads)
    const engagement = this.getEngagementSummary(leadId);
    
    let enhancedHtml = originalHtml;
    
    // Add engagement section if this is a returning lead
    if (engagement.engagementScore > 0) {
      const engagementSection = `
        <div class="engagement-alert" style="background: #E3F2FD; border: 2px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #1976D2; margin: 0 0 10px 0;">🔥 Lead Engagement History</h3>
          <p style="margin: 5px 0;"><strong>Engagement Level:</strong> ${engagement.summary}</p>
          <p style="margin: 5px 0;"><strong>Email Opens:</strong> ${engagement.emailOpens}</p>
          <p style="margin: 5px 0;"><strong>Link Clicks:</strong> ${engagement.linkClicks}</p>
          ${engagement.lastActivity ? `<p style="margin: 5px 0;"><strong>Last Activity:</strong> ${new Date(engagement.lastActivity).toLocaleString()}</p>` : ''}
          ${engagement.isHotLead ? '<p style="color: #D32F2F; font-weight: bold;">⚡ PRIORITY FOLLOW-UP RECOMMENDED</p>' : ''}
        </div>
      `;
      
      // Insert engagement section after the urgent alert
      enhancedHtml = enhancedHtml.replace(
        '</div>',
        `</div>${engagementSection}`
      );
    }
    
    // Replace phone and email links with trackable versions
    enhancedHtml = enhancedHtml.replace(
      `href="tel:${formData.phone}"`,
      `href="${phoneTrackable}"`
    );
    
    enhancedHtml = enhancedHtml.replace(
      `href="mailto:${formData.email}`,
      `href="${emailTrackable}`
    );
    
    // Add tracking pixel before closing body tag
    enhancedHtml = enhancedHtml.replace(
      '</body>',
      `${trackingPixel}</body>`
    );
    
    return enhancedHtml;
  }

  // Enhanced welcome email with tracking
  enhanceWelcomeEmail(originalHtml, leadId) {
    const trackingPixel = this.generateTrackingPixel(leadId, 'welcome');
    
    // Add trackable links for key actions
    const phoneTrackable = this.generateTrackableLink('tel:4045516532', leadId, 'customer_call');
    const websiteTrackable = this.generateTrackableLink('https://ekosolarpros.com', leadId, 'website_visit');
    
    let enhancedHtml = originalHtml;
    
    // Replace phone link
    enhancedHtml = enhancedHtml.replace(
      'href="tel:4045516532"',
      `href="${phoneTrackable}"`
    );
    
    // Add tracking pixel
    enhancedHtml = enhancedHtml.replace(
      '</body>',
      `${trackingPixel}</body>`
    );
    
    return enhancedHtml;
  }
}

module.exports = EmailAnalyticsService;