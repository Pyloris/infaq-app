const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve '@' path alias to './src' directory
// This mirrors the tsconfig paths: { "@/*": ["src/*"] }
config.resolver.extraNodeModules = {
    '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
