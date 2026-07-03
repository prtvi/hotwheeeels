const middlewares = require('./middlewares');
const cars = require('./cars');
const stats = require('./stats');
const {
	captureWebsiteVisit,
	netlifyDeploymentWebhook,
	getRuntimeConfig,
} = require('./config');

/**
 * Composed route handlers for `app.js`. Split across middlewares, cars, stats, and config.
 */
exports.r = {
	...middlewares,
	...cars,
	...stats,
	captureWebsiteVisit,
	netlifyDeploymentWebhook,
	getRuntimeConfig,
};
