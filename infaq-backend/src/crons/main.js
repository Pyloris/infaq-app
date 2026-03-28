const { startPledgerCron } = require('./pledger.cron');
const { startMigrationCron } = require('./migration.cron');

const initCrons = () => {
    console.log('[System] Initializing Background Crons...');
    startPledgerCron();
    startMigrationCron();
};

module.exports = initCrons;
