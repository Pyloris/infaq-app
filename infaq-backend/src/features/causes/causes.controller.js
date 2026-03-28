const causesService = require('./causes.service');
const catchError = require('../../errors/catch-error');

const getCauses = catchError(async (req, res) => {
    const causes = await causesService.getCausesForUser(req.user.id);

    res.status(200).json({
        success: true,
        data: { causes },
    });
});

module.exports = {
    getCauses,
};
