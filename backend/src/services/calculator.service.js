class CalculatorService {
  constructor() {
    // Solar data constants
    this.SOLAR_CONSTANTS = {
      PEAK_SUN_HOURS: {
        // Georgia average peak sun hours by region
        '30000': 5.38, // Atlanta area
        '31000': 5.45, // Augusta area  
        '39000': 5.28, // Columbus area
        '31200': 5.52, // Savannah area
        'default': 5.4  // Georgia average
      },
      PANEL_WATTS: 400, // Typical residential panel wattage
      SYSTEM_DERATE: 0.85, // System efficiency factor
      ENERGY_ESCALATION: 0.03, // 3% annual energy cost increase
      FEDERAL_TAX_CREDIT: 0.30, // 30% federal tax credit
      GEORGIA_TAX_CREDIT: 0.35, // Georgia tax credit (up to $5,000)
      SYSTEM_LIFESPAN: 25, // Years
      MAINTENANCE_COST_ANNUAL: 0.005, // 0.5% of system cost annually
      CO2_REDUCTION_PER_KWH: 0.7 // lbs CO2 per kWh
    };

    // Utility rates by region ($/kWh)
    this.UTILITY_RATES = {
      'Georgia Power': 0.1289,
      'Savannah Electric': 0.1156,
      'Walton EMC': 0.1098,
      'Jackson EMC': 0.1143,
      'default': 0.1200
    };
  }

  // Get peak sun hours for ZIP code
  getPeakSunHours(zipCode) {
    const zipPrefix = zipCode.substring(0, 3) + '00';
    return this.SOLAR_CONSTANTS.PEAK_SUN_HOURS[zipPrefix] || this.SOLAR_CONSTANTS.PEAK_SUN_HOURS.default;
  }

  // Get utility rate for ZIP code or company
  getUtilityRate(zipCode, utilityCompany = null) {
    if (utilityCompany && this.UTILITY_RATES[utilityCompany]) {
      return this.UTILITY_RATES[utilityCompany];
    }
    return this.UTILITY_RATES.default;
  }

  // Calculate solar savings
  async calculateSolarSavings(input) {
    const {
      monthlyBill,
      zipCode,
      roofArea,
      roofOrientation = 'south',
      roofTilt,
      shading = 'minimal',
      propertyType = 'residential',
      utilityCompany,
      currentUsage
    } = input;

    try {
      // Calculate annual energy usage from bill
      const utilityRate = this.getUtilityRate(zipCode, utilityCompany);
      const annualUsage = currentUsage || (monthlyBill * 12) / utilityRate;

      // Calculate system size needed
      const peakSunHours = this.getPeakSunHours(zipCode);
      const orientationFactor = this.getOrientationFactor(roofOrientation);
      const shadingFactor = this.getShadingFactor(shading);
      const tiltFactor = this.getTiltFactor(roofTilt, zipCode);

      // System size calculation
      const systemSizeKw = annualUsage / (peakSunHours * 365 * orientationFactor * shadingFactor * tiltFactor * this.SOLAR_CONSTANTS.SYSTEM_DERATE);
      
      // Cap system size for residential
      const maxSystemSize = propertyType === 'residential' ? 15 : 100;
      const recommendedSystemSize = Math.min(Math.round(systemSizeKw * 10) / 10, maxSystemSize);

      // Calculate energy production
      const annualProduction = recommendedSystemSize * peakSunHours * 365 * orientationFactor * shadingFactor * tiltFactor * this.SOLAR_CONSTANTS.SYSTEM_DERATE;

      // Calculate costs and savings
      const systemCostBeforeIncentives = this.calculateSystemCost(recommendedSystemSize, propertyType);
      const federalCredit = Math.min(systemCostBeforeIncentives * this.SOLAR_CONSTANTS.FEDERAL_TAX_CREDIT, systemCostBeforeIncentives);
      const stateCredit = Math.min(systemCostBeforeIncentives * this.SOLAR_CONSTANTS.GEORGIA_TAX_CREDIT, 5000);
      const systemCostAfterIncentives = systemCostBeforeIncentives - federalCredit - stateCredit;

      // Calculate savings
      const annualSavings = Math.min(annualProduction * utilityRate, monthlyBill * 12);
      const monthlySavings = annualSavings / 12;
      const savingsPercentage = (annualSavings / (monthlyBill * 12)) * 100;

      // Payback period
      const paybackPeriod = systemCostAfterIncentives / annualSavings;

      // 25-year savings
      const totalSavings25Years = this.calculate25YearSavings(annualSavings, systemCostAfterIncentives);

      // Environmental impact
      const co2ReductionAnnual = annualProduction * this.SOLAR_CONSTANTS.CO2_REDUCTION_PER_KWH;
      const co2Reduction25Years = co2ReductionAnnual * 25;

      return {
        systemRecommendation: {
          systemSizeKw: recommendedSystemSize,
          panelsNeeded: Math.ceil(recommendedSystemSize * 1000 / this.SOLAR_CONSTANTS.PANEL_WATTS),
          annualProduction: Math.round(annualProduction),
          roofAreaNeeded: Math.ceil(recommendedSystemSize * 80), // ~80 sq ft per kW
          orientationFactor,
          shadingFactor
        },
        costs: {
          systemCostBeforeIncentives: Math.round(systemCostBeforeIncentives),
          federalTaxCredit: Math.round(federalCredit),
          georgiaStateCredit: Math.round(stateCredit),
          systemCostAfterIncentives: Math.round(systemCostAfterIncentives),
          paybackPeriod: Math.round(paybackPeriod * 10) / 10
        },
        savings: {
          firstYearSavings: Math.round(annualSavings),
          monthlySavings: Math.round(monthlySavings),
          savingsPercentage: Math.round(savingsPercentage),
          totalSavings25Years: Math.round(totalSavings25Years),
          netProfit25Years: Math.round(totalSavings25Years - systemCostAfterIncentives)
        },
        environmental: {
          co2ReductionAnnual: Math.round(co2ReductionAnnual),
          co2Reduction25Years: Math.round(co2Reduction25Years),
          treesEquivalent: Math.round(co2Reduction25Years / 48), // 1 tree absorbs ~48 lbs CO2/year
        },
        assumptions: {
          peakSunHours,
          utilityRate,
          energyEscalation: this.SOLAR_CONSTANTS.ENERGY_ESCALATION,
          systemLifespan: this.SOLAR_CONSTANTS.SYSTEM_LIFESPAN
        }
      };

    } catch (error) {
      console.error('Solar savings calculation error:', error);
      throw new Error('Unable to calculate solar savings');
    }
  }

  // Calculate system cost based on size and type
  calculateSystemCost(systemSizeKw, propertyType = 'residential') {
    // Cost per watt installed (includes panels, inverters, installation, permits)
    const costPerWatt = {
      residential: systemSizeKw <= 6 ? 3.20 : (systemSizeKw <= 12 ? 2.90 : 2.70),
      commercial: systemSizeKw <= 50 ? 2.50 : 2.30,
      industrial: 2.10
    };

    const basePrice = (costPerWatt[propertyType] || costPerWatt.residential) * systemSizeKw * 1000;
    
    // Add fixed costs (permits, interconnection, etc.)
    const fixedCosts = propertyType === 'residential' ? 2000 : 5000;
    
    return basePrice + fixedCosts;
  }

  // Calculate system size recommendation
  async calculateSystemSize(input) {
    const { annualUsage, zipCode, roofOrientation = 'south', shading = 'minimal' } = input;

    const peakSunHours = this.getPeakSunHours(zipCode);
    const orientationFactor = this.getOrientationFactor(roofOrientation);
    const shadingFactor = this.getShadingFactor(shading);

    const systemSizeKw = annualUsage / (peakSunHours * 365 * orientationFactor * shadingFactor * this.SOLAR_CONSTANTS.SYSTEM_DERATE);
    const recommendedSize = Math.round(systemSizeKw * 10) / 10;

    return {
      recommendedSystemSize: recommendedSize,
      panelsNeeded: Math.ceil(recommendedSize * 1000 / this.SOLAR_CONSTANTS.PANEL_WATTS),
      roofAreaNeeded: Math.ceil(recommendedSize * 80),
      estimatedProduction: Math.round(recommendedSize * peakSunHours * 365 * this.SOLAR_CONSTANTS.SYSTEM_DERATE),
      peakSunHours,
      factors: {
        orientationFactor,
        shadingFactor
      }
    };
  }

  // Calculate payback period
  async calculatePaybackPeriod(input) {
    const {
      systemCost,
      monthlyBill,
      zipCode,
      systemSize,
      includeIncentives = true
    } = input;

    const utilityRate = this.getUtilityRate(zipCode);
    const annualSavings = Math.min((monthlyBill * 12), systemSize ? systemSize * this.getPeakSunHours(zipCode) * 365 * this.SOLAR_CONSTANTS.SYSTEM_DERATE * utilityRate : (monthlyBill * 12 * 0.9));

    let finalSystemCost = systemCost;

    if (includeIncentives) {
      const federalCredit = systemCost * this.SOLAR_CONSTANTS.FEDERAL_TAX_CREDIT;
      const stateCredit = Math.min(systemCost * this.SOLAR_CONSTANTS.GEORGIA_TAX_CREDIT, 5000);
      finalSystemCost = systemCost - federalCredit - stateCredit;
    }

    const paybackPeriod = finalSystemCost / annualSavings;

    return {
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      systemCostAfterIncentives: Math.round(finalSystemCost),
      annualSavings: Math.round(annualSavings),
      totalSavings25Years: Math.round(this.calculate25YearSavings(annualSavings, finalSystemCost)),
      incentivesApplied: includeIncentives ? {
        federalTaxCredit: Math.round(systemCost * this.SOLAR_CONSTANTS.FEDERAL_TAX_CREDIT),
        georgiaStateCredit: Math.round(Math.min(systemCost * this.SOLAR_CONSTANTS.GEORGIA_TAX_CREDIT, 5000))
      } : null
    };
  }

  // Calculate ROI
  async calculateROI(input) {
    const {
      initialInvestment,
      annualSavings,
      systemLifespan = 25,
      maintenanceCosts = 0,
      energyEscalation = 0.03
    } = input;

    let totalSavings = 0;
    let totalMaintenanceCosts = 0;

    // Calculate year-by-year savings with energy escalation
    for (let year = 1; year <= systemLifespan; year++) {
      const yearSavings = annualSavings * Math.pow(1 + energyEscalation, year - 1);
      totalSavings += yearSavings;
      totalMaintenanceCosts += maintenanceCosts * Math.pow(1.02, year - 1); // 2% maintenance inflation
    }

    const netSavings = totalSavings - totalMaintenanceCosts;
    const totalROI = ((netSavings - initialInvestment) / initialInvestment) * 100;
    const annualROI = Math.pow((netSavings / initialInvestment), (1 / systemLifespan)) - 1;

    return {
      totalROI: Math.round(totalROI * 10) / 10,
      annualROI: Math.round(annualROI * 1000) / 10, // Percentage
      netProfit: Math.round(netSavings - initialInvestment),
      totalSavings: Math.round(totalSavings),
      totalMaintenanceCosts: Math.round(totalMaintenanceCosts),
      paybackPeriod: Math.round((initialInvestment / annualSavings) * 10) / 10,
      breakEvenYear: Math.ceil(initialInvestment / annualSavings)
    };
  }

  // Get available incentives
  async getAvailableIncentives(zipCode) {
    // Federal incentives
    const federalIncentives = [
      {
        name: 'Federal Solar Tax Credit (ITC)',
        type: 'tax_credit',
        value: 30,
        unit: 'percent',
        maxValue: null,
        description: '30% of system cost as federal tax credit',
        expiration: '2032-12-31'
      }
    ];

    // Georgia state incentives
    const stateIncentives = [
      {
        name: 'Georgia Solar Tax Credit',
        type: 'tax_credit', 
        value: 35,
        unit: 'percent',
        maxValue: 5000,
        description: '35% of system cost up to $5,000 as Georgia tax credit',
        expiration: '2025-12-31'
      }
    ];

    // Local incentives (would query database in real app)
    const localIncentives = [];

    // Utility incentives
    const utilityIncentives = [
      {
        name: 'Net Metering',
        type: 'net_metering',
        value: 100,
        unit: 'percent',
        description: 'Full retail credit for excess solar energy sent to grid',
        provider: 'Georgia Power'
      }
    ];

    return {
      federal: federalIncentives,
      state: stateIncentives,
      local: localIncentives,
      utility: utilityIncentives,
      totalPotentialSavings: {
        percentage: 65, // 30% federal + 35% state
        maxAmount: 5000,
        note: 'Federal credit is unlimited, state credit capped at $5,000'
      }
    };
  }

  // Get solar irradiance data
  async getSolarData(zipCode) {
    const peakSunHours = this.getPeakSunHours(zipCode);
    
    return {
      peakSunHours,
      annualSolarIrradiance: Math.round(peakSunHours * 365),
      solarPotential: peakSunHours > 5.2 ? 'excellent' : (peakSunHours > 4.8 ? 'very good' : (peakSunHours > 4.4 ? 'good' : 'fair')),
      monthlyProduction: this.getMonthlyProductionData(zipCode),
      weatherFactors: {
        clearDays: 180,
        partlyCloudyDays: 120,
        cloudyDays: 65
      }
    };
  }

  // Helper methods
  getOrientationFactor(orientation) {
    const factors = {
      south: 1.0,
      southwest: 0.96,
      southeast: 0.96,
      west: 0.86,
      east: 0.86,
      north: 0.68
    };
    return factors[orientation] || factors.south;
  }

  getShadingFactor(shading) {
    const factors = {
      none: 1.0,
      minimal: 0.95,
      moderate: 0.85,
      heavy: 0.65
    };
    return factors[shading] || factors.minimal;
  }

  getTiltFactor(tilt, zipCode) {
    if (!tilt) return 1.0;
    
    // Optimal tilt for Georgia is approximately latitude (32-35 degrees)
    const optimalTilt = 33;
    const tiltDifference = Math.abs(tilt - optimalTilt);
    
    if (tiltDifference <= 5) return 1.0;
    if (tiltDifference <= 15) return 0.95;
    if (tiltDifference <= 25) return 0.90;
    return 0.85;
  }

  calculate25YearSavings(firstYearSavings, systemCost) {
    let totalSavings = 0;
    for (let year = 1; year <= 25; year++) {
      const yearSavings = firstYearSavings * Math.pow(1 + this.SOLAR_CONSTANTS.ENERGY_ESCALATION, year - 1);
      totalSavings += yearSavings;
    }
    
    // Subtract maintenance costs
    const totalMaintenanceCosts = systemCost * this.SOLAR_CONSTANTS.MAINTENANCE_COST_ANNUAL * 25;
    
    return totalSavings - totalMaintenanceCosts;
  }

  getMonthlyProductionData(zipCode) {
    const peakSunHours = this.getPeakSunHours(zipCode);
    const monthlyFactors = [0.75, 0.85, 0.95, 1.05, 1.15, 1.20, 1.18, 1.10, 1.00, 0.90, 0.80, 0.70];
    
    return monthlyFactors.map((factor, index) => ({
      month: index + 1,
      peakSunHours: Math.round(peakSunHours * factor * 10) / 10,
      productionFactor: factor
    }));
  }
}

module.exports = new CalculatorService();