// Intelligent lead scoring system for EkoSolar prospects
class LeadScoringService {
  constructor() {
    this.scoreWeights = {
      electricBill: {
        base: 10,
        thresholds: [
          { min: 500, score: 100 },  // Premium customers
          { min: 350, score: 80 },   // High-value
          { min: 250, score: 60 },   // Good prospects
          { min: 150, score: 40 },   // Standard
          { min: 100, score: 20 },   // Basic
          { min: 0, score: 10 }      // Low usage
        ]
      },
      location: {
        premium: ['buckhead', 'sandy springs', 'dunwoody', 'roswell', 'alpharetta', 'johns creek'],
        highValue: ['atlanta', 'brookhaven', 'decatur', 'chamblee', 'doraville'],
        standard: ['stone mountain', 'tucker', 'norcross', 'duluth'],
        scores: {
          premium: 50,
          highValue: 30,
          standard: 20,
          other: 10
        }
      },
      urgency: {
        keywords: [
          { phrases: ['asap', 'urgent', 'soon', 'immediately', 'this week'], score: 30 },
          { phrases: ['interested', 'ready', 'looking', 'planning'], score: 20 },
          { phrases: ['considering', 'thinking', 'maybe', 'someday'], score: 5 }
        ]
      },
      homeValue: {
        indicators: [
          { phrases: ['mansion', 'estate', 'luxury', 'custom home'], score: 40 },
          { phrases: ['large home', 'big house', '5 bedroom', '6 bedroom', 'pool'], score: 25 },
          { phrases: ['townhouse', 'condo', 'apartment'], score: -10 }
        ]
      },
      timing: {
        weekend: 5,      // People research on weekends
        business: 15,    // Business hours = serious inquiry
        evening: 10      // Evening research = interested
      }
    };
  }

  // Calculate comprehensive lead score
  calculateLeadScore(formData) {
    let totalScore = 0;
    const scoring = {
      electricBill: 0,
      location: 0,
      urgency: 0,
      homeValue: 0,
      timing: 0,
      total: 0,
      category: '',
      priority: '',
      insights: []
    };

    // Score electric bill (most important factor)
    scoring.electricBill = this.scoreElectricBill(formData.electricBill);
    totalScore += scoring.electricBill;

    // Score location
    scoring.location = this.scoreLocation(formData.address);
    totalScore += scoring.location;

    // Score urgency from message
    if (formData.message) {
      scoring.urgency = this.scoreUrgency(formData.message);
      totalScore += scoring.urgency;

      // Score home value indicators
      scoring.homeValue = this.scoreHomeValue(formData.message);
      totalScore += scoring.homeValue;
    }

    // Score timing (current time)
    scoring.timing = this.scoreTiming();
    totalScore += scoring.timing;

    scoring.total = totalScore;
    scoring.category = this.categorizeScore(totalScore);
    scoring.priority = this.determinePriority(totalScore);
    scoring.insights = this.generateInsights(formData, scoring);

    return scoring;
  }

  scoreElectricBill(billAmount) {
    if (!billAmount) return 10; // Default if no bill provided
    
    const amount = parseFloat(billAmount);
    
    for (const threshold of this.scoreWeights.electricBill.thresholds) {
      if (amount >= threshold.min) {
        return threshold.score;
      }
    }
    
    return 5; // Very low bill
  }

  scoreLocation(address) {
    if (!address) return 10; // Default if no address
    
    const addressLower = address.toLowerCase();
    
    // Check for premium locations
    for (const location of this.scoreWeights.location.premium) {
      if (addressLower.includes(location)) {
        return this.scoreWeights.location.scores.premium;
      }
    }
    
    // Check for high-value locations
    for (const location of this.scoreWeights.location.highValue) {
      if (addressLower.includes(location)) {
        return this.scoreWeights.location.scores.highValue;
      }
    }
    
    // Check for standard locations
    for (const location of this.scoreWeights.location.standard) {
      if (addressLower.includes(location)) {
        return this.scoreWeights.location.scores.standard;
      }
    }
    
    return this.scoreWeights.location.scores.other;
  }

  scoreUrgency(message) {
    if (!message) return 0;
    
    const messageLower = message.toLowerCase();
    
    for (const urgencyLevel of this.scoreWeights.urgency.keywords) {
      for (const phrase of urgencyLevel.phrases) {
        if (messageLower.includes(phrase)) {
          return urgencyLevel.score;
        }
      }
    }
    
    return 0;
  }

  scoreHomeValue(message) {
    if (!message) return 0;
    
    const messageLower = message.toLowerCase();
    
    for (const indicator of this.scoreWeights.homeValue.indicators) {
      for (const phrase of indicator.phrases) {
        if (messageLower.includes(phrase)) {
          return indicator.score;
        }
      }
    }
    
    return 0;
  }

  scoreTiming() {
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    
    if (isWeekend) {
      return this.scoreWeights.timing.weekend;
    }
    
    // Business hours (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17) {
      return this.scoreWeights.timing.business;
    }
    
    // Evening (6 PM - 10 PM)
    if (hour >= 18 && hour <= 22) {
      return this.scoreWeights.timing.evening;
    }
    
    return 0; // Late night/early morning
  }

  categorizeScore(score) {
    if (score >= 200) return 'Platinum Lead';
    if (score >= 150) return 'Gold Lead';
    if (score >= 100) return 'Silver Lead';
    if (score >= 60) return 'Bronze Lead';
    return 'Standard Lead';
  }

  determinePriority(score) {
    if (score >= 180) return 'URGENT';
    if (score >= 120) return 'HIGH';
    if (score >= 80) return 'MEDIUM';
    return 'STANDARD';
  }

  generateInsights(formData, scoring) {
    const insights = [];
    
    // Electric bill insights
    if (scoring.electricBill >= 80) {
      insights.push('💰 High electric bill indicates excellent solar savings potential');
    } else if (scoring.electricBill >= 40) {
      insights.push('💡 Moderate electric bill - good candidate for solar');
    }
    
    // Location insights
    if (scoring.location >= 40) {
      insights.push('🏘️ Premium location - likely high property value and solar investment capacity');
    } else if (scoring.location >= 25) {
      insights.push('📍 Good location - strong solar adoption area');
    }
    
    // Urgency insights
    if (scoring.urgency >= 25) {
      insights.push('⚡ High urgency indicators - prioritize immediate follow-up');
    } else if (scoring.urgency >= 15) {
      insights.push('🎯 Shows interest - good follow-up candidate');
    }
    
    // Home value insights
    if (scoring.homeValue >= 30) {
      insights.push('🏡 High-value home indicators - premium system candidate');
    }
    
    // Timing insights
    if (scoring.timing >= 15) {
      insights.push('🕐 Submitted during business hours - serious inquiry');
    } else if (scoring.timing >= 10) {
      insights.push('🌅 Evening submission - researching after work');
    }
    
    // Overall recommendations
    if (scoring.total >= 150) {
      insights.push('🚨 PRIORITY LEAD: Contact within 1 hour for best conversion');
    } else if (scoring.total >= 100) {
      insights.push('📞 Quality lead: Contact within 4 hours');
    } else if (scoring.total >= 60) {
      insights.push('📧 Good prospect: Follow up within 24 hours');
    }
    
    return insights;
  }

  // Generate priority alert styling for emails
  generatePriorityAlert(scoring) {
    const priority = scoring.priority;
    const category = scoring.category;
    
    let backgroundColor, borderColor, textColor, icon;
    
    switch (priority) {
      case 'URGENT':
        backgroundColor = '#FFEBEE';
        borderColor = '#F44336';
        textColor = '#C62828';
        icon = '🚨';
        break;
      case 'HIGH':
        backgroundColor = '#FFF3E0';
        borderColor = '#FF9800';
        textColor = '#E65100';
        icon = '🔥';
        break;
      case 'MEDIUM':
        backgroundColor = '#E8F5E8';
        borderColor = '#4CAF50';
        textColor = '#2E7D32';
        icon = '⭐';
        break;
      default:
        backgroundColor = '#F3F4F6';
        borderColor = '#9CA3AF';
        textColor = '#374151';
        icon = '📋';
    }
    
    return `
      <div class="priority-alert" style="background: ${backgroundColor}; border: 3px solid ${borderColor}; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: ${textColor}; margin: 0 0 15px 0; font-size: 18px;">
          ${icon} ${priority} PRIORITY - ${category}
        </h3>
        <div style="color: ${textColor}; font-weight: bold; margin-bottom: 10px;">
          Lead Score: ${scoring.total}/200 points
        </div>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #333;">💡 AI Insights:</h4>
          ${scoring.insights.map(insight => `<div style="margin: 5px 0; color: #555;">• ${insight}</div>`).join('')}
        </div>
      </div>
    `;
  }

  // Generate scoring breakdown for analytics
  generateScoringBreakdown(scoring) {
    return `
      <div class="scoring-breakdown" style="background: #F8F9FA; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin: 0 0 15px 0; color: #333;">📊 Lead Scoring Breakdown</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>Electric Bill: <strong>${scoring.electricBill} pts</strong></div>
          <div>Location: <strong>${scoring.location} pts</strong></div>
          <div>Urgency: <strong>${scoring.urgency} pts</strong></div>
          <div>Home Value: <strong>${scoring.homeValue} pts</strong></div>
          <div>Timing: <strong>${scoring.timing} pts</strong></div>
          <div style="grid-column: 1 / -1; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
            <strong>Total Score: ${scoring.total} points</strong>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = LeadScoringService;