const twilio = require('twilio');

class TwilioSMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    // Support both API Key and Auth Token authentication
    this.apiKeySid = process.env.TWILIO_API_KEY_SID;
    this.apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.adminPhone = process.env.ADMIN_PHONE || '4045516532';
    
    // Use API Key if available (more secure), otherwise fall back to Auth Token
    if (this.apiKeySid && this.apiKeySecret) {
      if (!this.accountSid || !this.apiKeySid || !this.apiKeySecret || !this.fromNumber) {
        throw new Error('Twilio credentials are required: TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, TWILIO_PHONE_NUMBER');
      }
      this.client = twilio(this.apiKeySid, this.apiKeySecret, { accountSid: this.accountSid });
    } else {
      if (!this.accountSid || !this.authToken || !this.fromNumber) {
        throw new Error('Twilio credentials are required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
      }
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      console.log(`📤 Sending SMS via Twilio to ${phoneNumber}...`);
      
      // Use direct number (more reliable than messaging service)
      const messageConfig = {
        body: message,
        to: phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`,
        from: this.fromNumber
      };
      
      const result = await this.client.messages.create(messageConfig);
      
      console.log(`✅ Twilio SMS sent successfully: ${result.sid}`);
      return { 
        success: true, 
        messageId: result.sid, 
        status: result.status,
        provider: 'twilio'
      };
    } catch (error) {
      console.error('❌ Twilio SMS failed:', error.message);
      return {
        success: false,
        error: error.message,
        provider: 'twilio'
      };
    }
  }

  // Send SMS notification to admin about new form submission
  async sendAdminSMSNotification(formData) {
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = this.createAdminSMSMessage(formData, timestamp);
    
    return this.sendSMS({
      to: this.formatPhoneNumber(this.adminPhone),
      message
    });
  }

  createAdminSMSMessage(formData, timestamp) {
    // Keep SMS concise due to character limits
    let message = `🌟 NEW SOLAR LEAD!\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    
    if (formData.electricBill) {
      message += `Bill: $${formData.electricBill}/mo\n`;
    }
    
    if (formData.address) {
      // Extract city/state from address for brevity
      const addressParts = formData.address.split(',');
      const location = addressParts.length >= 2 ? 
        addressParts.slice(-2).join(',').trim() : 
        formData.address.substring(0, 30) + '...';
      message += `Location: ${location}\n`;
    }
    
    message += `Time: ${timestamp}\n`;
    message += `\nCheck email for full details.`;
    
    return message;
  }

  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Add +1 if it's a 10-digit US number
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    
    // Add + if it doesn't start with +
    if (!digits.startsWith('1') && digits.length === 11) {
      return `+${digits}`;
    }
    
    return digits.startsWith('+') ? digits : `+${digits}`;
  }

  // Test SMS functionality
  async sendTestSMS() {
    const testMessage = `🧪 EkoSolar SMS Test\nYour SMS notification system is working!\nTime: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`;
    
    return this.sendSMS({
      to: this.formatPhoneNumber(this.adminPhone),
      message: testMessage
    });
  }
}

module.exports = TwilioSMSService;