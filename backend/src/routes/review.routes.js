const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/email.service');
const router = express.Router();

// Validation middleware for reviews
const validateReview = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Content must be between 20 and 1000 characters'),
  
  body('serviceType')
    .isIn(['installation', 'repair', 'maintenance', 'consultation', 'emergency', 'other'])
    .withMessage('Invalid service type'),
  
  body('installationDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid installation date'),
  
  body('systemSize')
    .optional()
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('System size must be between 0.1 and 1000 kW'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  
  body('recommend')
    .optional()
    .isBoolean()
    .withMessage('Recommend must be true or false'),
  
  body('photos')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 photos allowed'),
  
  body('consentToPublish')
    .isBoolean()
    .withMessage('Consent to publish is required')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must consent to publish your review');
      }
      return true;
    })
];

// POST /api/reviews/submit - Submit a customer review
router.post('/submit', validateReview, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      rating,
      title,
      content,
      serviceType,
      installationDate,
      systemSize,
      location,
      recommend = true,
      photos = [],
      consentToPublish
    } = req.body;

    // Generate review ID
    const reviewId = `REV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const reviewData = {
      reviewId,
      name,
      email,
      rating,
      title,
      content,
      serviceType,
      installationDate: installationDate ? new Date(installationDate) : null,
      systemSize,
      location,
      recommend,
      photos,
      consentToPublish,
      status: 'pending_approval',
      submittedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Send review notifications
    try {
      await emailService.sendReviewNotification(reviewData);
      await emailService.sendReviewThankYou(reviewData);
    } catch (emailError) {
      console.error('Review email error:', emailError);
      // Don't fail the request if email fails
    }

    // Log the review submission
    console.log('Review submitted:', {
      reviewId,
      name,
      rating,
      serviceType,
      location,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your review! It will be published after our team reviews it.',
      reviewId,
      rating,
      estimatedPublishTime: '1-2 business days'
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to submit review. Please try again later.'
    });
  }
});

// GET /api/reviews/public - Get published reviews (for website display)
router.get('/public', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      serviceType,
      minRating = 1,
      sortBy = 'newest'
    } = req.query;

    // Validate query parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const minRatingNum = parseInt(minRating);

    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    if (minRatingNum < 1 || minRatingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Minimum rating must be between 1 and 5'
      });
    }

    // Mock review data (in real app, this would query the database)
    const mockReviews = [
      {
        reviewId: 'REV-1692834567890-ABC12',
        name: 'John Smith',
        rating: 5,
        title: 'Excellent Solar Installation',
        content: 'EkoSolar did an amazing job installing our 8kW system. Professional, on-time, and great communication throughout the process.',
        serviceType: 'installation',
        installationDate: '2024-07-15',
        systemSize: 8.0,
        location: 'Atlanta, GA',
        recommend: true,
        publishedAt: '2024-07-20T10:30:00Z'
      },
      {
        reviewId: 'REV-1692834567891-DEF34',
        name: 'Sarah Johnson',
        rating: 5,
        title: 'Fast Emergency Repair Service',
        content: 'Our system went down during a storm and EkoSolar had a technician out the same day. Excellent emergency service!',
        serviceType: 'emergency',
        location: 'Savannah, GA',
        recommend: true,
        publishedAt: '2024-07-18T14:45:00Z'
      },
      {
        reviewId: 'REV-1692834567892-GHI56',
        name: 'Mike Rodriguez',
        rating: 4,
        title: 'Great Maintenance Service',
        content: 'Regular maintenance keeps our system running at peak efficiency. Very thorough and professional team.',
        serviceType: 'maintenance',
        systemSize: 12.5,
        location: 'Augusta, GA',
        recommend: true,
        publishedAt: '2024-07-16T09:15:00Z'
      }
    ];

    // Filter reviews based on query parameters
    let filteredReviews = mockReviews.filter(review => {
      if (serviceType && review.serviceType !== serviceType) return false;
      if (review.rating < minRatingNum) return false;
      return true;
    });

    // Sort reviews
    if (sortBy === 'newest') {
      filteredReviews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'oldest') {
      filteredReviews.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'rating_high') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating_low') {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    }

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    // Calculate statistics
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    
    const ratingDistribution = {
      5: filteredReviews.filter(r => r.rating === 5).length,
      4: filteredReviews.filter(r => r.rating === 4).length,
      3: filteredReviews.filter(r => r.rating === 3).length,
      2: filteredReviews.filter(r => r.rating === 2).length,
      1: filteredReviews.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      success: true,
      data: {
        reviews: paginatedReviews,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalReviews / limitNum),
          totalReviews,
          hasNextPage: endIndex < totalReviews,
          hasPrevPage: pageNum > 1
        },
        statistics: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution
        }
      }
    });

  } catch (error) {
    console.error('Reviews retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve reviews. Please try again later.'
    });
  }
});

// GET /api/reviews/stats - Get review statistics
router.get('/stats', async (req, res) => {
  try {
    // Mock statistics (in real app, this would query the database)
    const stats = {
      totalReviews: 287,
      averageRating: 4.9,
      ratingDistribution: {
        5: 245, // 85.4%
        4: 35,  // 12.2%
        3: 5,   // 1.7%
        2: 1,   // 0.3%
        1: 1    // 0.3%
      },
      serviceBreakdown: {
        installation: 156,
        maintenance: 67,
        repair: 34,
        consultation: 18,
        emergency: 12
      },
      monthlyGrowth: {
        thisMonth: 23,
        lastMonth: 19,
        growthRate: '+21%'
      },
      recommendationRate: 98.6 // Percentage of customers who would recommend
    };

    res.status(200).json({
      success: true,
      data: stats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve review statistics.'
    });
  }
});

// POST /api/reviews/request - Request review from customer
router.post('/request', [
  body('customerEmail')
    .isEmail()
    .withMessage('Valid customer email is required')
    .normalizeEmail(),
  
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  
  body('serviceType')
    .isIn(['installation', 'repair', 'maintenance', 'consultation', 'emergency', 'other'])
    .withMessage('Invalid service type'),
  
  body('serviceDate')
    .isISO8601()
    .withMessage('Valid service date is required'),
  
  body('projectDetails')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Project details must be less than 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      customerEmail,
      customerName,
      serviceType,
      serviceDate,
      projectDetails
    } = req.body;

    const reviewRequestData = {
      customerEmail,
      customerName,
      serviceType,
      serviceDate: new Date(serviceDate),
      projectDetails,
      requestedAt: new Date(),
      requestId: `RR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };

    // Send review request email to customer
    try {
      await emailService.sendReviewRequest(reviewRequestData);
    } catch (emailError) {
      console.error('Review request email error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Unable to send review request email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review request sent successfully',
      requestId: reviewRequestData.requestId
    });

  } catch (error) {
    console.error('Review request error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to send review request. Please try again later.'
    });
  }
});

module.exports = router;