// Netlify function to save push notification tokens
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

    // In a real implementation, you'd save this to a database
    // For now, we'll just log it and save to environment or file
    console.log('📱 New push token received:', token);
    
    // You could save to:
    // 1. Database (recommended)
    // 2. Environment variable (temporary)
    // 3. File storage
    
    // For this demo, we'll store in memory/environment
    // In production, use a proper database
    process.env.ADMIN_PUSH_TOKEN = token;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Push token saved successfully'
      })
    };

  } catch (error) {
    console.error('Error saving push token:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to save push token',
        message: error.message
      })
    };
  }
};