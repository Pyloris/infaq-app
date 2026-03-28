const User = require('../auth/user.model');
const pledgeService = require('../pledge/pledge.service');
const causesService = require('../causes/causes.service');

const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    return user;
};

const getDashboardData = async (userId) => {
    const totalContribution = await pledgeService.getTotalLifetimeContribution(userId);
    const causes = await causesService.getCausesForUser(userId);
    const recentTransactions = await pledgeService.getRecentTransactions(userId, 3);

    return {
        total_contribution: totalContribution,
        causes,
        recent_transactions: recentTransactions,
    };
};

module.exports = {
    getUserById,
    getDashboardData,
};
