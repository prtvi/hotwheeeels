const middlewares = require('./middlewares');
const cars = require('./cars');
const stats = require('./stats');
const {
	captureWebsiteVisit,
	getWebsiteVisitStats,
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
	getWebsiteVisitStats,
	netlifyDeploymentWebhook,
	getRuntimeConfig,
};
