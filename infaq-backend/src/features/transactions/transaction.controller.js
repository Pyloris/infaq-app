const transactionService = require('./transaction.service');
const pledgeService = require('../pledge/pledge.service');
const catchError = require('../../errors/catch-error');

const getMyTransactions = catchError(async (req, res) => {
    const transactions = await transactionService.getUserTransactions(req.user.id);
    const total = await pledgeService.getTotalLifetimeContribution(req.user.id);

    res.status(200).json({
        success: true,
        data: {
            transactions,
            metrics: { total_contribution: total },
        },
    });
});

const getAllTransactions = catchError(async (req, res) => {
    const transactions = await transactionService.getAllTransactions();
    const total = await transactionService.getGlobalTotalContribution();

    res.status(200).json({
        success: true,
        data: {
            transactions,
            metrics: { total_contribution: total },
        },
    });
});

module.exports = {
    getMyTransactions,
    getAllTransactions,
};
