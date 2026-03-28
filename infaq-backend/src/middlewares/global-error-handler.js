const globalErrorHandler = (err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    console.error(`[Error] ${status} - ${message}:`, err.stack);

    if (err.name === 'ZodError') {
        status = 400;
        message = 'Validation Error';
        // Use err.issues or err.errors safely
        const issues = err.issues || err.errors || [];
        errors = issues.map(e => ({
            path: e.path.join('.'),
            message: e.message,
        }));
    }

    res.status(status).json({
        success: false,
        message,
        errors,
    });
};

module.exports = globalErrorHandler;
