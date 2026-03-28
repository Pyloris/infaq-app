const { z } = require('zod');

const pledgeCreateSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1'),
    frequency: z.enum(['one-time', 'monthly', 'yearly']),
});

module.exports = {
    pledgeCreateSchema,
};
