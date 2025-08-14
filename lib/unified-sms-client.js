const TwilioSMSService = require('./sms-client');
const TelnyxSMSService = require('./telnyx-sms-client');

class UnifiedSMSService {
  constructor() {
    this.providers = [];
    this.adminPhone = process.env.ADMIN_PHONE || '4045516532';
    
    // Initialize available SMS providers
    this.initializeProviders();
  }

  initializeProviders() {
    // Try to initialize Telnyx (primary)
    try {
      if (process.env.TELNYX_API_KEY) {
        this.providers.push({
          name: 'telnyx',
          service: new TelnyxSMSService(),
          priority: 1
        });
        console.log('✅ Telnyx SMS provider initialized');
      }
    } catch (error) {
      console.log('⚠️ Telnyx SMS not available:', error.message);
    }

    // Try to initialize Twilio (fallback)
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        this.providers.push({
          name: 'twilio',
          service: new TwilioSMSService(),
          priority: 2
        });
        console.log('✅ Twilio SMS provider initialized (fallback)');
      }
    } catch (error) {
      console.log('⚠️ Twilio SMS not available:', error.message);
    }

    // Sort by priority (lower number = higher priority)
    this.providers.sort((a, b) => a.priority - b.priority);
    
    console.log(`📱 SMS providers available: ${this.providers.length}`);
  }

  async sendSMS(phoneNumber, message) {
    if (this.providers.length === 0) {
      throw new Error('No SMS providers available');
    }

    console.log(`📤 Attempting SMS delivery via ${this.providers.length} providers...`);

    // Try each provider in priority order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      
      try {
        console.log(`🔄 Trying provider ${i + 1}: ${provider.name}`);
        
        const result = await provider.service.sendSMS(phoneNumber, message);
        
        if (result.success) {
          console.log(`✅ SMS sent successfully via ${provider.name}!`);
          return {
            success: true,
            provider: provider.name,
            messageId: result.messageId,
            status: result.status
          };
        } else {
          console.log(`❌ ${provider.name} failed: ${result.error}`);
        }
        
      } catch (error) {
        console.log(`❌ ${provider.name} error: ${error.message}`);
      }

      // Add delay between provider attempts
      if (i < this.providers.length - 1) {
        console.log('⏳ Waiting before trying next provider...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // If all providers failed
    console.log('❌ All SMS providers failed');
    return {
      success: false,
      error: 'All SMS providers failed',
      providersAttempted: this.providers.length
    };
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

Check email for details.`;
  }

  // Test all available providers
  async testAllProviders() {
    const testMessage = `🧪 MULTI-PROVIDER TEST
EkoSolar notification system
Time: ${new Date().toLocaleTimeString()}

Testing provider delivery!`;

    console.log('🧪 TESTING ALL SMS PROVIDERS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results = [];

    for (const provider of this.providers) {
      console.log(`🔄 Testing ${provider.name}...`);
      
      try {
        const result = await provider.service.sendSMS(this.adminPhone, testMessage);
        results.push({
          provider: provider.name,
          success: result.success,
          messageId: result.messageId || null,
          error: result.error || null
        });

        if (result.success) {
          console.log(`✅ ${provider.name}: SUCCESS`);
        } else {
          console.log(`❌ ${provider.name}: FAILED - ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${provider.name}: ERROR - ${error.message}`);
        results.push({
          provider: provider.name,
          success: false,
          error: error.message
        });
      }

      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n📊 TEST RESULTS SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    results.forEach((result, index) => {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`${index + 1}. ${result.provider.toUpperCase()}: ${status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    return results;
  }

  // Get provider status
  getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      priority: provider.priority,
      available: true
    }));
  }
}

module.exports = UnifiedSMSService;