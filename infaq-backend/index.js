const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/app-config');

const PORT = config.port;

const startServer = async () => {
    try {
        // Connect to MongoDB using Mongoose
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
