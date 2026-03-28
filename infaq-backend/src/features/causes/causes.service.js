const causesData = require('../../config/causes.json');
const pledgeService = require('../pledge/pledge.service');

const getCausesForUser = async (userId) => {
    const totalContribution = await pledgeService.getTotalLifetimeContribution(userId);

    return causesData.map((cause) => {
        const myContribution = (cause.percentage / 100) * totalContribution;
        return {
            ...cause,
            my_contribution: myContribution,
        };
    });
};

module.exports = {
    getCausesForUser,
};
