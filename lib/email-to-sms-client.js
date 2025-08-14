const ResendEmailService = require('./resend-client');
const GmailSMTPService = require('./gmail-smtp-client');

class EmailToSMSService {
  constructor() {
    this.emailService = new ResendEmailService();
    this.gmailService = new GmailSMTPService();
    this.adminPhone = process.env.ADMIN_PHONE || '4045516532';
  }

  // Major US carrier SMS gateways
  getCarrierGateways(phoneNumber) {
    // Remove all non-digits and format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    return [
      // Try all major carriers since we don't know which one
      `${cleanPhone}@txt.att.net`,        // AT&T
      `${cleanPhone}@vtext.com`,          // Verizon
      `${cleanPhone}@tmomail.net`,        // T-Mobile
      `${cleanPhone}@sms.myboostmobile.com`, // Boost Mobile
      `${cleanPhone}@msg.fi.google.com`,  // Google Fi
      `${cleanPhone}@mmst.net`,           // Sprint
      `${cleanPhone}@pm.sprint.com`,      // Sprint PCS
      `${cleanPhone}@messaging.sprintpcs.com`, // Sprint
      `${cleanPhone}@sms.cricketwireless.net`, // Cricket
      `${cleanPhone}@mms.uscc.net`,       // US Cellular
    ];
  }

  async sendSMSViaEmail(message, subject = 'EkoSolar Alert') {
    const gateways = this.getCarrierGateways(this.adminPhone);
    const results = [];
    
    console.log(`📧➡️📱 Sending SMS via email to ${this.adminPhone}...`);
    console.log(`Trying ${gateways.length} carrier gateways...`);
    
    // Try each gateway with better error handling and format optimization
    for (let i = 0; i < gateways.length; i++) {
      const gateway = gateways[i];
      
      try {
        // Add delay between requests to respect rate limits
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second
        }
        
        // Format message for SMS (keep it short and simple)
        const smsMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;
        
        const result = await this.emailService.sendEmail({
          to: gateway,
          subject: '', // Many carriers prefer empty subject for SMS
          html: smsMessage, // Simple text, no HTML formatting
          text: smsMessage
        });
        
        console.log(`✅ Gateway ${i + 1} (${gateway}): Sent`);
        results.push({ gateway, success: true, result });
        
        // Don't break early - try multiple gateways to increase delivery odds
        
      } catch (error) {
        console.log(`❌ Gateway ${i + 1} (${gateway}): Failed - ${error.message}`);
        results.push({ gateway, success: false, error: error.message });
        
        // Special handling for rate limit errors
        if (error.message.includes('Too many requests')) {
          console.log('⏳ Hit rate limit, waiting longer...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        }
      }
    }
    
    const successful = results.filter(r => r.success);
    
    console.log(`📊 Results: ${successful.length}/${gateways.length} gateways succeeded`);
    
    return {
      success: successful.length > 0,
      totalSent: successful.length,
      totalAttempted: gateways.length,
      results: results
    };
  }

  // Convert form data to SMS-friendly format
  createSMSMessage(formData) {
    return `🌟 NEW SOLAR LEAD!
${formData.name}
${formData.phone}
$${formData.electricBill}/mo
${formData.address ? formData.address.split(',').slice(-2).join(',').trim() : 'N/A'}`;
  }

  // Send form notification via email-to-SMS (try both methods)
  async sendFormNotificationSMS(formData) {
    const message = this.createSMSMessage(formData);
    
    console.log('📱 Attempting multi-method SMS delivery...');
    
    try {
      // Method 1: Try Gmail SMTP first (more reliable for carrier gateways)
      console.log('🔄 Method 1: Gmail SMTP to carrier gateways...');
      const gmailResult = await this.gmailService.sendSMSViaMultipleCarriers(this.adminPhone, message);
      
      if (gmailResult.success) {
        console.log('✅ Gmail SMTP SMS delivery successful!');
        return gmailResult;
      }
      
      console.log('⚠️ Gmail SMTP failed, trying Resend fallback...');
      
    } catch (gmailError) {
      console.log('❌ Gmail SMTP error:', gmailError.message);
    }
    
    try {
      // Method 2: Fallback to Resend
      console.log('🔄 Method 2: Resend to carrier gateways...');
      const resendResult = await this.sendSMSViaEmail(message, 'EkoSolar Lead Alert');
      
      if (resendResult.success) {
        console.log('✅ Resend SMS delivery successful!');
        return resendResult;
      }
      
      console.log('❌ Both SMS methods failed');
      return { success: false, error: 'All SMS methods failed' };
      
    } catch (resendError) {
      console.log('❌ Resend error:', resendError.message);
      return { success: false, error: 'All SMS methods failed' };
    }
  }

  // Test the email-to-SMS system (both methods)
  async testEmailToSMS() {
    const testMessage = `🧪 EMAIL-TO-SMS TEST
EkoSolar notification system
Multi-method delivery!
Time: ${new Date().toLocaleTimeString()}`;
    
    console.log('🧪 Testing multi-method email-to-SMS...');
    
    try {
      // Test Gmail SMTP method first
      console.log('🔄 Testing Gmail SMTP method...');
      const gmailResult = await this.gmailService.testGmailSMS(this.adminPhone);
      
      if (gmailResult.success) {
        console.log('✅ Gmail SMTP test successful!');
        return gmailResult;
      }
      
      console.log('⚠️ Gmail SMTP test failed, trying Resend...');
      
    } catch (gmailError) {
      console.log('❌ Gmail SMTP test error:', gmailError.message);
    }
    
    // Fallback to Resend method
    console.log('🔄 Testing Resend method...');
    return this.sendSMSViaEmail(testMessage, 'EkoSolar SMS Test');
  }
}

module.exports = EmailToSMSService;