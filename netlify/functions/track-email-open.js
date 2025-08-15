exports.handler = async (event, context) => {
  // Only accept GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    };
  }

  try {
    const trackingId = event.queryStringParameters?.id;
    
    // Get client information for simple logging
    const userAgent = event.headers['user-agent'] || '';
    const ipAddress = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    
    // Simple console logging (can be enhanced later)
    if (trackingId) {
      console.log(`📧 Email opened: ${trackingId} from ${ipAddress} (${userAgent.substring(0, 50)})`);
    }
    
    // Return a 1x1 transparent pixel
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: pixel.toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('Error in email tracking:', error);
    
    // Always return a pixel even if tracking fails
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': pixel.length
      },
      body: pixel.toString('base64'),
      isBase64Encoded: true
    };
  }
};