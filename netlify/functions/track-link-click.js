exports.handler = async (event, context) => {
  // Only accept GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    };
  }

  try {
    const { id: trackingId, url: originalUrl, link: linkName } = event.queryStringParameters || {};
    
    if (!originalUrl) {
      return {
        statusCode: 400,
        body: 'Missing URL parameter'
      };
    }

    // Get client information for simple logging
    const userAgent = event.headers['user-agent'] || '';
    const ipAddress = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    
    // Simple console logging (can be enhanced later)
    if (trackingId) {
      console.log(`🔗 Link clicked: ${linkName || 'unknown'} by ${trackingId} from ${ipAddress}`);
    }
    
    // Decode the original URL
    const decodedUrl = decodeURIComponent(originalUrl);
    
    // Redirect to the original URL
    return {
      statusCode: 302,
      headers: {
        'Location': decodedUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: ''
    };

  } catch (error) {
    console.error('Error tracking link click:', error);
    
    // Try to redirect to the original URL even if tracking fails
    const originalUrl = event.queryStringParameters?.url;
    if (originalUrl) {
      try {
        const decodedUrl = decodeURIComponent(originalUrl);
        return {
          statusCode: 302,
          headers: {
            'Location': decodedUrl
          },
          body: ''
        };
      } catch (decodeError) {
        // If URL decoding fails, redirect to homepage
        return {
          statusCode: 302,
          headers: {
            'Location': 'https://ekosolarpros.com'
          },
          body: ''
        };
      }
    }
    
    return {
      statusCode: 500,
      body: 'Error processing link click'
    };
  }
};