const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/email.service');
const router = express.Router();

// Validation middleware for appointment booking
const validateAppointment = [
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
    .notEmpty()
    .withMessage('Phone number is required for appointment scheduling')
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Property address is required')
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters'),
  
  body('serviceType')
    .isIn(['consultation', 'inspection', 'installation', 'repair', 'maintenance', 'emergency'])
    .withMessage('Invalid service type'),
  
  body('preferredDate')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now
      
      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      if (appointmentDate > maxDate) {
        throw new Error('Appointments can only be scheduled up to 3 months in advance');
      }
      
      return true;
    }),
  
  body('preferredTime')
    .isIn(['morning', 'afternoon', 'evening', 'anytime'])
    .withMessage('Invalid time preference'),
  
  body('propertyType')
    .optional()
    .isIn(['residential', 'commercial', 'industrial'])
    .withMessage('Invalid property type'),
  
  body('roofAccess')
    .optional()
    .isIn(['easy', 'difficult', 'restricted', 'unknown'])
    .withMessage('Invalid roof access option'),
  
  body('currentSystem')
    .optional()
    .isIn(['none', 'solar', 'backup-generator', 'other'])
    .withMessage('Invalid current system option'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  
  body('emergencyLevel')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid emergency level')
];

// POST /api/appointments/schedule - Schedule a new appointment
router.post('/schedule', validateAppointment, async (req, res) => {
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
      phone,
      address,
      serviceType,
      preferredDate,
      preferredTime,
      propertyType = 'residential',
      roofAccess,
      currentSystem,
      notes,
      emergencyLevel = 'low'
    } = req.body;

    // Generate appointment ID
    const appointmentId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const appointmentData = {
      appointmentId,
      name,
      email,
      phone,
      address,
      serviceType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      propertyType,
      roofAccess,
      currentSystem,
      notes,
      emergencyLevel,
      status: 'pending',
      createdAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Send appointment confirmation emails
    try {
      await emailService.sendAppointmentNotification(appointmentData);
      await emailService.sendAppointmentConfirmation(appointmentData);
    } catch (emailError) {
      console.error('Appointment email error:', emailError);
      // Don't fail the request if email fails
    }

    // Log appointment
    console.log('Appointment scheduled:', {
      appointmentId,
      name,
      email,
      serviceType,
      preferredDate,
      timestamp: new Date().toISOString()
    });

    // Determine response message based on service type
    let responseMessage = 'Appointment request received! We will confirm your appointment within 24 hours.';
    
    if (serviceType === 'emergency') {
      responseMessage = 'Emergency appointment request received! We will contact you within 1 hour.';
    } else if (serviceType === 'consultation') {
      responseMessage = 'Solar consultation scheduled! Our expert will contact you to confirm the appointment details.';
    }

    res.status(200).json({
      success: true,
      message: responseMessage,
      appointmentId,
      scheduledFor: preferredDate,
      serviceType
    });

  } catch (error) {
    console.error('Appointment scheduling error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to schedule appointment. Please try again later or call our office directly.'
    });
  }
});

// POST /api/appointments/reschedule - Reschedule an existing appointment
router.post('/reschedule', [
  body('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .matches(/^APP-\d{13}-[A-Z0-9]{5}$/)
    .withMessage('Invalid appointment ID format'),
  
  body('newDate')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      
      if (appointmentDate < today) {
        throw new Error('New appointment date cannot be in the past');
      }
      if (appointmentDate > maxDate) {
        throw new Error('Appointments can only be scheduled up to 3 months in advance');
      }
      
      return true;
    }),
  
  body('newTime')
    .isIn(['morning', 'afternoon', 'evening', 'anytime'])
    .withMessage('Invalid time preference'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason must be less than 200 characters')
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

    const { appointmentId, newDate, newTime, reason } = req.body;

    const rescheduleData = {
      appointmentId,
      originalDate: req.body.originalDate,
      newDate: new Date(newDate),
      newTime,
      reason,
      rescheduledAt: new Date(),
      ipAddress: req.ip
    };

    // Send reschedule notification
    try {
      await emailService.sendRescheduleNotification(rescheduleData);
    } catch (emailError) {
      console.error('Reschedule email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Reschedule request received! We will confirm your new appointment time within 4 hours.',
      appointmentId,
      newDate,
      newTime
    });

  } catch (error) {
    console.error('Appointment reschedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to reschedule appointment. Please call our office directly.'
    });
  }
});

// POST /api/appointments/cancel - Cancel an appointment
router.post('/cancel', [
  body('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .matches(/^APP-\d{13}-[A-Z0-9]{5}$/)
    .withMessage('Invalid appointment ID format'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Cancellation reason must be less than 200 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
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

    const { appointmentId, reason, email } = req.body;

    const cancellationData = {
      appointmentId,
      reason,
      email,
      cancelledAt: new Date(),
      ipAddress: req.ip
    };

    // Send cancellation notification
    try {
      await emailService.sendCancellationNotification(cancellationData);
      await emailService.sendCancellationConfirmation(cancellationData);
    } catch (emailError) {
      console.error('Cancellation email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. You will receive a confirmation email shortly.',
      appointmentId,
      cancelledAt: new Date()
    });

  } catch (error) {
    console.error('Appointment cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to cancel appointment. Please call our office directly.'
    });
  }
});

// GET /api/appointments/availability/:date - Check availability for a specific date
router.get('/availability/:date', async (req, res) => {
  try {
    const dateParam = req.params.date;
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date in YYYY-MM-DD format'
      });
    }

    const requestedDate = new Date(dateParam);
    const today = new Date();
    
    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check availability for past dates'
      });
    }

    // Mock availability data (in real app, this would query the database)
    const availability = {
      date: dateParam,
      available: true,
      timeSlots: {
        morning: { available: true, slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
        afternoon: { available: true, slots: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
        evening: { available: false, slots: [] }
      },
      notes: 'Standard business hours: 8:00 AM - 5:00 PM'
    };

    // Check if it's weekend
    const dayOfWeek = requestedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      availability.available = false;
      availability.timeSlots.morning.available = false;
      availability.timeSlots.afternoon.available = false;
      availability.notes = 'Weekend appointments available by special request only';
    }

    res.status(200).json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to check availability. Please try again later.'
    });
  }
});

module.exports = router;