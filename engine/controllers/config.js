const { u } = require('../utils/util.js');
const { Settings } = require('../utils/db.js');

const LDSTKey = 'last_deployment_success_time';

async function captureWebsiteVisit(req, res) {
	const webhookUrl = process.env.WEBSITE_VISIT_WEBHOOK_URL;
	if (!webhookUrl) {
		console.log('captureWebsiteVisit: WEBSITE_VISIT_WEBHOOK_URL not set');
		return res.status(500).send('webhook not configured');
	}

	const body = { ...req.body };
	if (body.src === null) body.src = 'blank';

	const text = Object.entries(body)
		.map(([key, value]) => `${key}: ${value}`)
		.join(' | ');

	const result = await u.makeRequest(webhookUrl, { text });
	const ok = result?.status >= 200 && result?.status < 300;

	if (!ok) {
		console.log(
			'captureWebsiteVisit webhook error',
			result?.response?.data ?? result?.message ?? result,
		);
		return res.status(400).send('error capturing log');
	}

	return res.send('captured');
}

async function netlifyDeploymentWebhook(req, res) {
	try {
		const payload = req.body ?? {};

		const event = payload.event ? String(payload.event) : undefined;
		const state = payload.state ? String(payload.state) : undefined;
		const incomingStatus = payload.status ?? payload.result ?? payload.outcome;
		const status =
			incomingStatus !== undefined && incomingStatus !== null
				? String(incomingStatus)
				: event ?? state ?? 'unknown';

		const looksSuccessful =
			event === 'deploy_succeeded' ||
			event === 'previously_failed_deploy_succeeded' ||
			state === 'ready' ||
			status === 'success' ||
			status === 'succeeded';

		const timeFromPayload =
			payload.created_at ??
			payload.published_at ??
			payload.updated_at ??
			payload.deploy_time ??
			payload.time;

		const time = timeFromPayload ? new Date(timeFromPayload) : new Date();
		const ts = Math.floor(time.getTime() / 1000);

		if (!looksSuccessful) return res.send({ ok: true, ignored: true, status, event, state });

		const doc = await Settings.findOneAndUpdate(
			{ key: LDSTKey },
			{
				key: LDSTKey,
				status,
				time,
				ts,
				payload,
			},
			{ upsert: true, new: true },
		);

		return res.send({ ok: true, settings: doc });
	} catch (err) {
		console.log('netlifyDeploymentWebhook error', err);
		return res.status(400).send({ ok: false });
	}
}

async function getRuntimeConfig(req, res) {
	try {
		await u.loadDbConfig();
		const env = process.env.ENV || 'prod';
		const cfg = u.getDbConfig();
		return res.send({
			env,
			key: `config_${env}`,
			config: cfg,
		});
	} catch (err) {
		console.log('getRuntimeConfig error', err);
		const env = process.env.ENV || 'prod';
		return res.status(400).send({ env, key: `config_${env}`, config: null });
	}
}

module.exports = {
	LDSTKey,
	captureWebsiteVisit,
	netlifyDeploymentWebhook,
	getRuntimeConfig,
};
