const Pledge = require('./pledge.model');
const Transaction = require('./transaction.model');

const createOrUpdatePledge = async (userId, data) => {
    const pledge = await Pledge.findOneAndUpdate(
        { userId },
        {
            ...data,
            status: 'pending',
        },
        {
            new: true,
            upsert: true,
        }
    );
    return pledge;
};

const getUserPledge = async (userId) => {
    return await Pledge.findOne({ userId });
};

const updatePledgeStatusFromWebhook = async (pledgeId, eventType) => {
    let status = 'pending';
    const pledge = await Pledge.findById(pledgeId);

    if (!pledge) return null;

    if (eventType === 'payment.success') {
        status = 'active';

        // Record the lifetime contribution transaction
        await Transaction.create({
            userId: pledge.userId,
            pledgeId: pledge._id,
            transactionId: `WEB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: pledge.amount,
            status: 'success',
        });
    } else if (eventType === 'payment.failed') {
        status = 'pending';
    } else if (eventType === 'subscription.stopped') {
        status = 'stopped';
    }

    return await Pledge.findByIdAndUpdate(pledgeId, { status }, { new: true });
};

const getTotalLifetimeContribution = async (userId) => {
    const transactions = await Transaction.find({ userId, status: 'success' });
    return transactions.reduce((total, t) => total + t.amount, 0);
};

const getRecentTransactions = async (userId, limit = 3) => {
    return await Transaction.find({ userId, status: 'success' })
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = {
    createOrUpdatePledge,
    getUserPledge,
    updatePledgeStatusFromWebhook,
    getTotalLifetimeContribution,
    getRecentTransactions,
};
