const nodemailer = require('nodemailer');

class GmailSMTPService {
  constructor() {
    this.gmailUser = 'ekosolarize@gmail.com';
    this.gmailPassword = process.env.GMAIL_APP_PASSWORD; // App-specific password
    
    // Create SMTP transporter for Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.gmailUser,
        pass: this.gmailPassword
      }
    });
  }

  async sendEmailToSMSGateway(phoneNumber, message, carrierGateway) {
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const smsEmail = `${cleanPhone}@${carrierGateway}`;
    
    // Keep message under 160 characters for SMS
    const smsMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;
    
    const mailOptions = {
      from: this.gmailUser,
      to: smsEmail,
      subject: '', // Empty subject for SMS
      text: smsMessage,
      // No HTML for SMS gateways
    };
    
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ SMS sent via ${smsEmail}: ${result.messageId}`);
      return { success: true, messageId: result.messageId, gateway: smsEmail };
    } catch (error) {
      console.log(`❌ SMS failed via ${smsEmail}: ${error.message}`);
      return { success: false, error: error.message, gateway: smsEmail };
    }
  }

  async sendSMSViaMultipleCarriers(phoneNumber, message) {
    // Major carrier domains
    const carriers = [
      'txt.att.net',        // AT&T
      'vtext.com',          // Verizon
      'tmomail.net',        // T-Mobile
      'messaging.sprintpcs.com', // Sprint
      'sms.myboostmobile.com',   // Boost Mobile
      'msg.fi.google.com',       // Google Fi
      'mms.uscc.net',           // US Cellular
      'sms.cricketwireless.net' // Cricket
    ];
    
    console.log(`📧➡️📱 Sending SMS to ${phoneNumber} via Gmail SMTP...`);
    
    const results = [];
    
    for (let i = 0; i < carriers.length; i++) {
      const carrier = carriers[i];
      
      try {
        // Add delay to avoid overwhelming the SMTP server
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const result = await this.sendEmailToSMSGateway(phoneNumber, message, carrier);
        results.push(result);
        
        // If successful, we can continue to try other carriers too
        // This increases delivery odds since we don't know the exact carrier
        
      } catch (error) {
        results.push({ 
          success: false, 
          error: error.message, 
          gateway: `${phoneNumber.replace(/\D/g, '')}@${carrier}` 
        });
      }
    }
    
    const successful = results.filter(r => r.success);
    
    console.log(`📊 Gmail SMTP Results: ${successful.length}/${carriers.length} carriers succeeded`);
    
    return {
      success: successful.length > 0,
      totalSent: successful.length,
      totalAttempted: carriers.length,
      results: results
    };
  }

  // Test the Gmail SMTP to SMS system
  async testGmailSMS(phoneNumber = '4045516532') {
    const testMessage = `🧪 GMAIL SMS TEST
EkoSolar notification system
Working via Gmail SMTP!
Time: ${new Date().toLocaleTimeString()}`;
    
    return this.sendSMSViaMultipleCarriers(phoneNumber, testMessage);
  }
}

module.exports = GmailSMTPService;