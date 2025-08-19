const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/email.service');
const router = express.Router();

// Validation middleware for contact form
const validateContactForm = [
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
  
  body('phone')
    .optional()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  
  body('service')
    .optional()
    .isIn(['installation', 'repair', 'maintenance', 'consultation', 'emergency', 'other'])
    .withMessage('Invalid service type'),
  
  body('propertyType')
    .optional()
    .isIn(['residential', 'commercial', 'industrial'])
    .withMessage('Invalid property type'),
  
  body('roofType')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Roof type must be less than 50 characters'),
  
  body('energyBill')
    .optional()
    .isNumeric()
    .withMessage('Energy bill must be a number')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Energy bill must be between 0 and 10000'),
  
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'emergency'])
    .withMessage('Invalid urgency level'),
  
  body('preferredContact')
    .optional()
    .isIn(['email', 'phone', 'text'])
    .withMessage('Invalid contact preference'),
  
  body('bestTime')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Best time must be less than 100 characters'),
  
  body('hearAboutUs')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source must be less than 100 characters')
];

// POST /api/contact - Submit contact form
router.post('/', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
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
      phone,
      address,
      message,
      service = 'consultation',
      propertyType,
      roofType,
      energyBill,
      urgency = 'medium',
      preferredContact = 'email',
      bestTime,
      hearAboutUs
    } = req.body;

    // Create contact submission object
    const contactSubmission = {
      name,
      email,
      phone,
      address,
      message,
      service,
      propertyType,
      roofType,
      energyBill,
      urgency,
      preferredContact,
      bestTime,
      hearAboutUs,
      submittedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Send email notification
    try {
      await emailService.sendContactNotification(contactSubmission);
      await emailService.sendAutoReply(contactSubmission);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, but log it
    }

    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      service,
      urgency,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your interest in EkoSolar! We will contact you within 24 hours.',
      submissionId: `ES-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process your request. Please try again later.'
    });
  }
});

// POST /api/contact/quote - Request solar quote
router.post('/quote', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Property address is required'),
  body('propertyType').isIn(['residential', 'commercial', 'industrial']).withMessage('Invalid property type'),
  body('roofSize').optional().isNumeric().withMessage('Roof size must be a number'),
  body('energyBill').isNumeric().withMessage('Monthly energy bill must be a number'),
  body('roofCondition').optional().isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid roof condition'),
  body('timeframe').optional().isIn(['immediate', '1-3months', '3-6months', '6+months']).withMessage('Invalid timeframe')
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

    const quoteRequest = {
      ...req.body,
      type: 'quote_request',
      submittedAt: new Date(),
      ipAddress: req.ip
    };

    // Send quote request email
    try {
      await emailService.sendQuoteRequestNotification(quoteRequest);
      await emailService.sendQuoteAutoReply(quoteRequest);
    } catch (emailError) {
      console.error('Quote email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for your quote request! Our solar experts will contact you within 2 business hours.',
      quoteId: `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process your quote request. Please try again later.'
    });
  }
});

// POST /api/contact/emergency - Emergency solar repair request
router.post('/emergency', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required for emergency service'),
  body('address').trim().notEmpty().withMessage('Service address is required'),
  body('issue').trim().notEmpty().withMessage('Please describe the emergency issue'),
  body('systemAge').optional().isNumeric().withMessage('System age must be a number'),
  body('urgencyLevel').isIn(['high', 'critical']).withMessage('Emergency requests must be high or critical urgency')
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

    const emergencyRequest = {
      ...req.body,
      type: 'emergency_request',
      submittedAt: new Date(),
      ipAddress: req.ip
    };

    // Send emergency notification (high priority)
    try {
      await emailService.sendEmergencyNotification(emergencyRequest);
      await emailService.sendEmergencyAutoReply(emergencyRequest);
    } catch (emailError) {
      console.error('Emergency email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Emergency request received! Our technician will contact you within 1 hour.',
      emergencyId: `EM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

  } catch (error) {
    console.error('Emergency request error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process emergency request. Please call our emergency line immediately.'
    });
  }
});

module.exports = router;