const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Migration = require('../migrations/migration.model');

const startMigrationCron = () => {
    // Run every minute to check for new migration files
    cron.schedule('* * * * *', async () => {
        const migrationDir = path.join(__dirname, '../migrations');

        try {
            const files = fs.readdirSync(migrationDir);
            const migrationFiles = files.filter(f => f.endsWith('.js') && f !== 'migration.model.js');

            for (const file of migrationFiles) {
                const migrationPath = path.join(migrationDir, file);
                const migrationModule = require(migrationPath);

                const { name, migrate } = migrationModule;

                const alreadyExecuted = await Migration.findOne({ name });

                if (!alreadyExecuted) {
                    console.log(`[Migration] Starting: ${name}...`);

                    // Execute the migration with raw DB access
                    await migrate(mongoose.connection.db);

                    // Mark as executed
                    await Migration.create({ name });

                    console.log(`[Migration] Successfully completed: ${name}`);
                }
            }
        } catch (error) {
            console.error('[Migration] Critical Error:', error);
        }
    });
};

module.exports = { startMigrationCron };
