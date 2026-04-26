const { u } = require('../utils/util.js');
const { Log, Settings } = require('../utils/db.js');

const LDSTKey = 'last_deployment_success_time';

function captureWebsiteVisit(req, res) {
	const body = req.body;
	if (body.src === null) body.src = 'blank';

	const now = new Date();
	const ts = Math.floor(now.getTime() / 1000);

	const log = new Log({
		url: body.url,
		src: body.src,
		createdAt: now,
		ts: ts,
	});

	log.save()
		.then(() => res.send('captured'))
		.catch(err => res.status(400).send('error capturing log'));
}

async function getWebsiteVisitStats(req, res) {
	const groupBy = req.query.group_by;

	const dateExtremes = await Log.aggregate([
		{ $sort: { ts: 1 } },
		{
			$group: {
				_id: null,
				first: { $first: '$$ROOT' },
				last: { $last: '$$ROOT' },
			},
		},
		{
			$project: {
				from: {
					$dateToString: {
						format: '%Y-%m-%d %H:%M:%S',
						date: '$first.createdAt',
					},
				},
				to: {
					$dateToString: {
						format: '%Y-%m-%d %H:%M:%S',
						date: '$last.createdAt',
					},
				},
				_id: 0,
			},
		},
	]).exec();

	const out = { showing_data_for: dateExtremes[0] };

	let groupByRes;

	if (groupBy === 'day') {
		groupByRes = await Log.aggregate([
			{
				$group: {
					_id: {
						$dateToString: {
							format: '%Y-%m-%d',
							date: '$createdAt',
						},
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{
				$project: {
					date: '$_id',
					count: '$count',
					_id: 0,
				},
			},
		]).exec();

		out.group_by_day = groupByRes;
	} else {
		groupByRes = await Log.aggregate([
			{ $group: { _id: '$src', count: { $sum: 1 } } },
			{ $sort: { _id: 1 } },
			{ $project: { src: '$_id', count: '$count', _id: 0 } },
		]).exec();

		out.group_by_src = groupByRes;
	}

	let total = 0;
	groupByRes.forEach(d => (total += d.count));
	out.total_count = total;

	return res.send(out);
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
	getWebsiteVisitStats,
	netlifyDeploymentWebhook,
	getRuntimeConfig,
};
