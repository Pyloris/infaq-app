const Transaction = require('../pledge/transaction.model');

const getUserTransactions = async (userId) => {
    return await Transaction.find({ userId, status: 'success' })
        .sort({ createdAt: -1 });
};

const getAllTransactions = async () => {
    return await Transaction.find({ status: 'success' })
        .populate('userId', 'name email mobileNumber city state')
        .sort({ createdAt: -1 });
};

const getGlobalTotalContribution = async () => {
    const transactions = await Transaction.find({ status: 'success' });
    return transactions.reduce((total, t) => total + t.amount, 0);
};

module.exports = {
    getUserTransactions,
    getAllTransactions,
    getGlobalTotalContribution,
};
