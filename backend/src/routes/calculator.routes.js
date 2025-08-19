const express = require('express');
const { body, validationResult } = require('express-validator');
const calculatorService = require('../services/calculator.service');
const router = express.Router();

// Validation middleware for solar calculations
const validateSolarCalculation = [
  body('monthlyBill')
    .isFloat({ min: 10, max: 10000 })
    .withMessage('Monthly electric bill must be between $10 and $10,000'),
  
  body('zipCode')
    .matches(/^\d{5}$/)
    .withMessage('Please provide a valid 5-digit ZIP code'),
  
  body('roofArea')
    .optional()
    .isFloat({ min: 100, max: 50000 })
    .withMessage('Roof area must be between 100 and 50,000 sq ft'),
  
  body('roofOrientation')
    .optional()
    .isIn(['south', 'southwest', 'southeast', 'east', 'west', 'north'])
    .withMessage('Invalid roof orientation'),
  
  body('roofTilt')
    .optional()
    .isFloat({ min: 0, max: 90 })
    .withMessage('Roof tilt must be between 0 and 90 degrees'),
  
  body('shading')
    .optional()
    .isIn(['none', 'minimal', 'moderate', 'heavy'])
    .withMessage('Invalid shading option'),
  
  body('propertyType')
    .optional()
    .isIn(['residential', 'commercial', 'industrial'])
    .withMessage('Invalid property type'),
  
  body('utilityCompany')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Utility company name too long'),
  
  body('currentUsage')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Current usage must be a positive number')
];

// POST /api/calculator/solar-savings - Calculate solar savings
router.post('/solar-savings', validateSolarCalculation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const calculationInput = {
      monthlyBill: parseFloat(req.body.monthlyBill),
      zipCode: req.body.zipCode,
      roofArea: req.body.roofArea ? parseFloat(req.body.roofArea) : null,
      roofOrientation: req.body.roofOrientation || 'south',
      roofTilt: req.body.roofTilt ? parseFloat(req.body.roofTilt) : null,
      shading: req.body.shading || 'minimal',
      propertyType: req.body.propertyType || 'residential',
      utilityCompany: req.body.utilityCompany,
      currentUsage: req.body.currentUsage ? parseFloat(req.body.currentUsage) : null
    };

    // Perform solar savings calculation
    const calculations = await calculatorService.calculateSolarSavings(calculationInput);

    res.status(200).json({
      success: true,
      data: calculations,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Solar calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to calculate solar savings. Please try again later.'
    });
  }
});

// POST /api/calculator/system-size - Calculate recommended system size
router.post('/system-size', [
  body('annualUsage')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('Annual usage must be between 1,000 and 1,000,000 kWh'),
  
  body('zipCode')
    .matches(/^\d{5}$/)
    .withMessage('Please provide a valid 5-digit ZIP code'),
  
  body('roofOrientation')
    .optional()
    .isIn(['south', 'southwest', 'southeast', 'east', 'west', 'north'])
    .withMessage('Invalid roof orientation'),
  
  body('shading')
    .optional()
    .isIn(['none', 'minimal', 'moderate', 'heavy'])
    .withMessage('Invalid shading option')
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

    const systemInput = {
      annualUsage: parseFloat(req.body.annualUsage),
      zipCode: req.body.zipCode,
      roofOrientation: req.body.roofOrientation || 'south',
      shading: req.body.shading || 'minimal'
    };

    const systemRecommendation = await calculatorService.calculateSystemSize(systemInput);

    res.status(200).json({
      success: true,
      data: systemRecommendation,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('System size calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to calculate system size. Please try again later.'
    });
  }
});

// POST /api/calculator/payback-period - Calculate solar payback period
router.post('/payback-period', [
  body('systemCost')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('System cost must be between $1,000 and $1,000,000'),
  
  body('monthlyBill')
    .isFloat({ min: 10, max: 10000 })
    .withMessage('Monthly bill must be between $10 and $10,000'),
  
  body('zipCode')
    .matches(/^\d{5}$/)
    .withMessage('Please provide a valid 5-digit ZIP code'),
  
  body('systemSize')
    .optional()
    .isFloat({ min: 1, max: 1000 })
    .withMessage('System size must be between 1 and 1000 kW'),
  
  body('includeIncentives')
    .optional()
    .isBoolean()
    .withMessage('Include incentives must be true or false')
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

    const paybackInput = {
      systemCost: parseFloat(req.body.systemCost),
      monthlyBill: parseFloat(req.body.monthlyBill),
      zipCode: req.body.zipCode,
      systemSize: req.body.systemSize ? parseFloat(req.body.systemSize) : null,
      includeIncentives: req.body.includeIncentives !== false
    };

    const paybackAnalysis = await calculatorService.calculatePaybackPeriod(paybackInput);

    res.status(200).json({
      success: true,
      data: paybackAnalysis,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Payback calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to calculate payback period. Please try again later.'
    });
  }
});

// GET /api/calculator/incentives/:zipCode - Get available incentives
router.get('/incentives/:zipCode', async (req, res) => {
  try {
    const zipCode = req.params.zipCode;
    
    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 5-digit ZIP code'
      });
    }

    const incentives = await calculatorService.getAvailableIncentives(zipCode);

    res.status(200).json({
      success: true,
      data: incentives,
      zipCode: zipCode
    });

  } catch (error) {
    console.error('Incentives lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to lookup incentives. Please try again later.'
    });
  }
});

// GET /api/calculator/solar-data/:zipCode - Get solar irradiance data
router.get('/solar-data/:zipCode', async (req, res) => {
  try {
    const zipCode = req.params.zipCode;
    
    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 5-digit ZIP code'
      });
    }

    const solarData = await calculatorService.getSolarData(zipCode);

    res.status(200).json({
      success: true,
      data: solarData,
      zipCode: zipCode
    });

  } catch (error) {
    console.error('Solar data lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to get solar data. Please try again later.'
    });
  }
});

// POST /api/calculator/roi - Calculate return on investment
router.post('/roi', [
  body('initialInvestment')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('Initial investment must be between $1,000 and $1,000,000'),
  
  body('annualSavings')
    .isFloat({ min: 100, max: 100000 })
    .withMessage('Annual savings must be between $100 and $100,000'),
  
  body('systemLifespan')
    .optional()
    .isInt({ min: 10, max: 50 })
    .withMessage('System lifespan must be between 10 and 50 years'),
  
  body('maintenanceCosts')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Maintenance costs must be between $0 and $10,000 per year'),
  
  body('energyEscalation')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Energy escalation rate must be between 0 and 20%')
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

    const roiInput = {
      initialInvestment: parseFloat(req.body.initialInvestment),
      annualSavings: parseFloat(req.body.annualSavings),
      systemLifespan: req.body.systemLifespan ? parseInt(req.body.systemLifespan) : 25,
      maintenanceCosts: req.body.maintenanceCosts ? parseFloat(req.body.maintenanceCosts) : 0,
      energyEscalation: req.body.energyEscalation ? parseFloat(req.body.energyEscalation) / 100 : 0.03
    };

    const roiAnalysis = await calculatorService.calculateROI(roiInput);

    res.status(200).json({
      success: true,
      data: roiAnalysis,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('ROI calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to calculate ROI. Please try again later.'
    });
  }
});

module.exports = router;