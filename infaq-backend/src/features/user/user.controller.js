const userService = require('./user.service');
const catchError = require('../../errors/catch-error');

const getMe = catchError(async (req, res) => {
    const user = await userService.getUserById(req.user.id);

    res.status(200).json({
        success: true,
        data: { user },
    });
});

const getDashboard = catchError(async (req, res) => {
    const dashboardData = await userService.getDashboardData(req.user.id);

    res.status(200).json({
        success: true,
        data: dashboardData,
    });
});

module.exports = {
    getMe,
    getDashboard,
};
