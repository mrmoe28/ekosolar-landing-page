const telnyx = require('telnyx');

class TelnyxSMSService {
  constructor() {
    this.apiKey = process.env.TELNYX_API_KEY;
    this.fromNumber = process.env.TELNYX_PHONE_NUMBER;
    this.adminPhone = process.env.ADMIN_PHONE || '4045516532';
    
    if (!this.apiKey || this.apiKey === 'your_telnyx_api_key_here') {
      throw new Error('TELNYX_API_KEY is required - sign up at https://telnyx.com/');
    }
    
    if (!this.fromNumber || this.fromNumber === 'your_telnyx_phone_number') {
      throw new Error('TELNYX_PHONE_NUMBER is required - purchase number from Telnyx');
    }
    
    // Initialize Telnyx client
    this.client = telnyx(this.apiKey);
  }

  async sendSMS(phoneNumber, message) {
    try {
      console.log(`📤 Sending SMS via Telnyx to ${phoneNumber}...`);
      
      const result = await this.client.messages.create({
        from: this.fromNumber,
        to: phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`,
        text: message,
        messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID // Optional
      });
      
      console.log(`✅ Telnyx SMS sent successfully: ${result.data.id}`);
      return {
        success: true,
        messageId: result.data.id,
        status: result.data.status,
        provider: 'telnyx'
      };
      
    } catch (error) {
      console.error('❌ Telnyx SMS failed:', error.message);
      return {
        success: false,
        error: error.message,
        provider: 'telnyx'
      };
    }
  }

  async sendAdminSMSNotification(formData) {
    const message = this.createSMSMessage(formData);
    return this.sendSMS(this.adminPhone, message);
  }

  // Create SMS-friendly message from form data
  createSMSMessage(formData) {
    return `🌟 NEW SOLAR LEAD!
${formData.name}
${formData.phone}
$${formData.electricBill}/mo
${formData.address ? formData.address.split(',').slice(-2).join(',').trim() : 'N/A'}

Check email for full details.`;
  }

  // Test SMS functionality
  async testSMS(phoneNumber = null) {
    const targetPhone = phoneNumber || this.adminPhone;
    const testMessage = `🧪 TELNYX SMS TEST
EkoSolar notification system
Provider: Telnyx
Time: ${new Date().toLocaleTimeString()}

Better T-Mobile delivery!`;

    return this.sendSMS(targetPhone, testMessage);
  }
}

module.exports = TelnyxSMSService;