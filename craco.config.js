module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];
      
      // Add your existing fallbacks
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
      };
      
      return webpackConfig;
    }
  }
};