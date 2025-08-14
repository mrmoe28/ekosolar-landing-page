const GoogleEnhancedEmailService = require('../../lib/google-enhanced-email');
const UnifiedSMSService = require('../../lib/unified-sms-client');
const FirebasePushService = require('../../lib/firebase-push-client');
const EmailAnalyticsService = require('../../lib/email-analytics');

// Rate limiting map (in-memory for simplicity)
const submissionTracker = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Rate limiting check
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'Too many submissions. Please try again later.' })
      };
    }

    // Initialize services
    const emailService = new GoogleEnhancedEmailService();
    const smsService = new UnifiedSMSService();
    const analyticsService = new EmailAnalyticsService();
    
    // Generate unique lead ID for tracking
    const leadId = generateLeadId(formData);
    
    // Prepare notification promises with email tracking
    const notificationPromises = [
      emailService.sendAdminNotificationWithTracking(formData, leadId, analyticsService),
      emailService.sendWelcomeEmailWithTracking(formData, leadId, analyticsService),
      smsService.sendAdminSMSNotification(formData) // Unified SMS with multiple providers
    ];
    
    // Add push notification if Firebase is properly configured
    const adminPushToken = process.env.ADMIN_PUSH_TOKEN;
    const firebaseServiceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (adminPushToken && adminPushToken !== 'your_admin_device_push_token_here' &&
        firebaseServiceKey && firebaseServiceKey !== 'your_firebase_service_account_json_here') {
      try {
        const pushService = new FirebasePushService();
        notificationPromises.push(
          pushService.sendFormNotificationPush(formData, adminPushToken)
        );
      } catch (error) {
        console.log('⚠️ Firebase push service initialization failed:', error.message);
      }
    }
    
    // Send all notifications in parallel for better performance
    const results = await Promise.allSettled(notificationPromises);
    const [adminResult, welcomeResult, smsResult, pushResult] = results;

    // Log results
    console.log('Admin notification:', adminResult);
    console.log('Welcome email:', welcomeResult);
    console.log('SMS notification:', smsResult);
    if (pushResult) {
      console.log('Push notification:', pushResult);
    }

    // Check if at least the admin notification was sent
    if (adminResult.status === 'rejected') {
      console.error('Failed to send admin notification:', adminResult.reason);
      // Still return success if welcome email was sent
      if (welcomeResult.status === 'rejected') {
        throw new Error('Failed to send both emails');
      }
    }

    // Log successful submission
    console.log(`Form submission processed for: ${formData.name} (${formData.email})`);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        details: {
          adminEmailSent: adminResult.status === 'fulfilled',
          welcomeEmailSent: welcomeResult.status === 'fulfilled',
          smsSent: smsResult.status === 'fulfilled' && smsResult.value?.success,
          pushSent: pushResult?.status === 'fulfilled' && pushResult.value?.success
        }
      })
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process form submission',
        message: error.message
      })
    };
  }
};

// Rate limiting function
function checkRateLimit(clientIP) {
  const now = Date.now();
  
  // Clean up old entries
  for (const [ip, data] of submissionTracker.entries()) {
    if (now - data.firstSubmission > RATE_LIMIT_WINDOW) {
      submissionTracker.delete(ip);
    }
  }
  
  // Check current IP
  if (submissionTracker.has(clientIP)) {
    const data = submissionTracker.get(clientIP);
    if (data.count >= MAX_SUBMISSIONS_PER_WINDOW) {
      return false; // Rate limit exceeded
    }
    data.count++;
  } else {
    submissionTracker.set(clientIP, {
      firstSubmission: now,
      count: 1
    });
  }
  
  return true;
}

// Generate unique lead ID for tracking
function generateLeadId(formData) {
  const timestamp = Date.now();
  const emailHash = Buffer.from(formData.email).toString('base64').slice(0, 8);
  const random = Math.random().toString(36).substring(2, 8);
  return `lead_${timestamp}_${emailHash}_${random}`;
}