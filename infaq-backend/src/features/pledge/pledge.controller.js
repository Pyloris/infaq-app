const pledgeService = require('./pledge.service');
const { pledgeCreateSchema } = require('./pledge.schema');
const catchError = require('../../errors/catch-error');

const createPledge = catchError(async (req, res) => {
    const validatedData = pledgeCreateSchema.parse(req.body);
    const pledge = await pledgeService.createOrUpdatePledge(req.user.id, validatedData);

    res.status(200).json({
        success: true,
        message: 'Pledge created successfully',
        data: { pledge },
    });
});

const getPledge = catchError(async (req, res) => {
    const pledge = await pledgeService.getUserPledge(req.user.id);

    if (!pledge) {
        return res.status(200).json({
            success: true,
            data: { pledge: null },
        });
    }

    res.status(200).json({
        success: true,
        data: { pledge },
    });
});

const handleWebhook = catchError(async (req, res) => {
    const { pledge_id, event_type } = req.body;

    if (!pledge_id || !event_type) {
        return res.status(400).json({
            success: false,
            message: 'pledge_id and event_type are required',
        });
    }

    const pledge = await pledgeService.updatePledgeStatusFromWebhook(pledge_id, event_type);

    res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: { pledge },
    });
});

module.exports = {
    createPledge,
    getPledge,
    handleWebhook,
};
