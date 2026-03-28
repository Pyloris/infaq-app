const cron = require('node-cron');
const Pledge = require('../features/pledge/pledge.model');
const Transaction = require('../features/pledge/transaction.model');

const startPledgerCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('[Cron] Running Pledger Mock Deduction...');

        try {
            const pledges = await Pledge.find();

            for (const pledge of pledges) {
                const txCount = await Transaction.countDocuments({
                    pledgeId: pledge._id,
                    status: 'success'
                });

                if (txCount < 5) {
                    await Transaction.create({
                        userId: pledge.userId,
                        pledgeId: pledge._id,
                        transactionId: `INFQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        amount: pledge.amount,
                        status: 'success',
                    });
                    console.log(`[Cron] Created mock transaction for pledge ${pledge._id}`);
                }
            }
        } catch (error) {
            console.error('[Cron] Error in Pledger Cron:', error);
        }
    });
};

module.exports = { startPledgerCron };
