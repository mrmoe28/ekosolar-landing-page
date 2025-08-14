const admin = require('firebase-admin');

class FirebasePushService {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      // You'll need to download the service account key from Firebase Console
      let serviceAccount = null;
      try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && 
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== 'your_firebase_service_account_json_here') {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
      } catch (error) {
        console.log('⚠️ Invalid Firebase service account key format');
      }
      
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID || 'ekosolar-notifications'
        });
        console.log('✅ Firebase Admin initialized for push notifications');
      } else {
        console.log('⚠️ Firebase Admin not initialized - service account key missing');
      }
    }
    
    this.messaging = admin.messaging();
  }

  async sendPushNotification(token, notification, data = {}) {
    try {
      console.log('📤 Sending push notification...');
      
      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl || null
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        },
        token: token,
        webpush: {
          notification: {
            icon: '/icons/ekosolar-icon-192x192.png',
            badge: '/icons/ekosolar-badge-72x72.png',
            tag: 'ekosolar-lead',
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [
              {
                action: 'view',
                title: 'View Lead'
              }
            ]
          },
          fcmOptions: {
            link: process.env.SITE_URL || 'https://ekosolarpros.com'
          }
        }
      };

      const result = await this.messaging.send(message);
      console.log('✅ Push notification sent successfully:', result);
      
      return {
        success: true,
        messageId: result,
        provider: 'firebase'
      };
      
    } catch (error) {
      console.error('❌ Push notification failed:', error.message);
      return {
        success: false,
        error: error.message,
        provider: 'firebase'
      };
    }
  }

  async sendFormNotificationPush(formData, userToken) {
    const notification = {
      title: '🌟 New Solar Lead!',
      body: `${formData.name} - $${formData.electricBill}/mo - ${formData.phone}`
    };

    const data = {
      type: 'form_submission',
      leadName: formData.name,
      leadPhone: formData.phone,
      leadEmail: formData.email,
      electricBill: formData.electricBill,
      address: formData.address || '',
      message: formData.message || ''
    };

    return this.sendPushNotification(userToken, notification, data);
  }

  async sendToMultipleTokens(tokens, notification, data = {}) {
    try {
      console.log(`📤 Sending push notification to ${tokens.length} devices...`);
      
      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        },
        tokens: tokens
      };

      const result = await this.messaging.sendEachForMulticast(message);
      console.log(`✅ Push notifications sent: ${result.successCount}/${tokens.length}`);
      
      return {
        success: result.successCount > 0,
        successCount: result.successCount,
        failureCount: result.failureCount,
        provider: 'firebase'
      };
      
    } catch (error) {
      console.error('❌ Multicast push notification failed:', error.message);
      return {
        success: false,
        error: error.message,
        provider: 'firebase'
      };
    }
  }

  // Test push notification
  async testPushNotification(userToken) {
    const notification = {
      title: '🧪 EkoSolar Push Test',
      body: `Push notifications working! Time: ${new Date().toLocaleTimeString()}`
    };

    const data = {
      type: 'test',
      testTime: new Date().toISOString()
    };

    return this.sendPushNotification(userToken, notification, data);
  }
}

module.exports = FirebasePushService;