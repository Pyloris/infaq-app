module.exports = {
    name: '20260321_add_transaction_ids',
    migrate: async (db) => {
        const transactions = await db.collection('transactions').find({
            transactionId: { $exists: false }
        }).toArray();

        console.log(`[Migration] Found ${transactions.length} transactions needing ID update...`);

        for (const tx of transactions) {
            // Generate a unique ID for each old transaction
            const newId = `MIG-${tx._id.toString().substring(0, 8)}-${Math.floor(Math.random() * 1000)}`;

            await db.collection('transactions').updateOne(
                { _id: tx._id },
                { $set: { transactionId: newId } }
            );
        }

        console.log(`[Migration] Successfully updated ${transactions.length} transactions.`);
    }
};
