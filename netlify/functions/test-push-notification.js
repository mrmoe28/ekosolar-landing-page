const FirebasePushService = require('../../lib/firebase-push-client');

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { token } = JSON.parse(event.body);
    
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required' })
      };
    }

    // Initialize Firebase push service
    const pushService = new FirebasePushService();
    
    // Send test notification
    const result = await pushService.testPushNotification(token);
    
    if (result.success) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Test notification sent successfully',
          messageId: result.messageId
        })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: result.error
        })
      };
    }

  } catch (error) {
    console.error('Error sending test notification:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send test notification',
        message: error.message
      })
    };
  }
};