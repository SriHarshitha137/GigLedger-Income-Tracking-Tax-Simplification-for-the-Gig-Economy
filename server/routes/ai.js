const express = require('express');
const IncomeEntry = require('../models/IncomeEntry');
const localAdvisoryService = require('../services/localAdvisoryService');
const { calculateTax } = require('../services/taxEngine');

const router = express.Router();

router.get('/tax-advisory', async (req, res, next) => {
  try {
    const taxSnapshot = await calculateTax(req.userId);
    const [topPlatform] = await IncomeEntry.aggregate([
      { $match: { userId: taxSnapshot.userId } },
      { $group: { _id: '$platform', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    const advice = await localAdvisoryService.getTaxAdvisory(req.userId, {
      grossIncome: taxSnapshot.grossIncome,
      taxableIncome: taxSnapshot.taxableIncome,
      estimatedTax: taxSnapshot.estimatedTaxLiability,
      gstAlert: taxSnapshot.gstThresholdAlert,
      topPlatform: topPlatform?._id || 'Not available',
      deductibleExpenses: taxSnapshot.expenseDeductions
    });

    return res.json({ success: true, data: { advice } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
