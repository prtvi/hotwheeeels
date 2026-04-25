const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { u } = require('./util.js');
const { getCarModel, Log, Settings } = require('./db.js');

function logger(req, res, next) {
	console.log(req.method, req.url);
	next();
}

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

function authMiddleware(req, res, next) {
	const token = req.headers.token;
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const verified = jwt.verify(token, jwtSecretKey);

		console.log('authenticated');
		if (verified) return next();
		else return res.status(401).send('unauthorised');
	} catch (error) {
		console.log('unauthourised');
		return res.status(401).send('unauthorised');
	}
}

async function getAllMasked(req, res) {
	const Car = getCarModel();
	const projection = u.getMaskedCarFields();
	const results = await Car.find({}, projection);

	if (results.length > 0) return res.send(results);
	else return res.status(400).send([]);
}

async function getAll(req, res) {
	const Car = getCarModel();
	const results = await Car.find();
	if (results.length > 0) return res.send(results);
	else return res.status(400).send([]);
}

function addCar(req, res) {
	const Car = getCarModel();
	const rBody = req.body;
	const carId = req.query.car_id;

	const car = new Car(u.newCarObj(rBody, carId));
	car.save()
		.then(() => {
			console.log('car saved in db');
			return res.send('car saved in db');
		})
		.catch(err => {
			console.log('error saving car', err);
			return res.status(400).send('error saving car');
		});
}

async function uploadImage(req, res) {
	const Car = getCarModel();
	const fileInput = req.files;
	const carId = req.query.car_id;

	const nFiles = fileInput.length;
	if (!fileInput || nFiles === 0)
		return res.status(400).send('no files were uploaded.');

	const deleteImgSuccess = await u.deletePicturesForCarId(carId);
	console.log('image delete msg:', deleteImgSuccess);

	const images = [];
	for (let i = 0; i < nFiles; i++) {
		const file = fileInput[i];

		const fd = new FormData();
		fd.append('img', new Blob([file.buffer]), file.originalname);

		const baseUrl = u.getEngineURL();
		const url = baseUrl + '/api/auth/get_img_url';

		const response = await u.makeRequest(url, fd, {
			headers: { token: req.headers.token },
		});
		if (response.status === 200) images.push(response.data);
	}

	if (images.length > 0) {
		// if images are uploaded and urls are created succesfully then update the urls into the db

		const updateRes = await Car.findOneAndUpdate(
			{ carId: carId },
			{ imgs: images },
			{ new: true },
		);

		if (updateRes.imgs.length > 0) {
			console.log('image upload success');
			return res.send('images uploaded successfully');
		} else {
			console.log('images upload failed', err);
			return res.status(400).send('images upload failed');
		}
	} else {
		// else delete the car document created in /add_car call

		const deleteRes = await Car.deleteOne({ carId: carId });

		if (deleteRes.deletedCount > 0 && deleteRes.acknowledged) {
			console.log('error uploading images, []images.length === 0');
			return res.status(400).send('error uploading images');
		} else {
			console.log('images upload failed', err);
			return res.status(400).send('images upload failed');
		}
	}
}

async function getImageUrl(req, res) {
	const file = req.file;
	const fnparts = file.originalname.split('.');
	const fileNameWoExt = fnparts.slice(0, fnparts.length - 1).join('');

	const buffer = await u.convertCompressAndReturnImageBuffer(file.buffer);
	const stream = cloudinary.uploader.upload_stream(
		{
			folder: u.getCloudinaryFolder(),
			public_id: fileNameWoExt,
			use_filename: true,
			overwrite: true,
		},
		(error, result) => {
			if (error) return res.status(500).send(error);

			console.log(result.secure_url);
			return res.send(result.secure_url);
		},
	);

	u.bufferToStream(buffer).pipe(stream);
}

async function deleteCar(req, res) {
	const Car = getCarModel();
	const carId = req.body.car_id;

	const deleteImgSuccess = await u.deletePicturesForCarId(carId);
	console.log('image delete msg:', deleteImgSuccess);

	const deleteRes = await Car.deleteOne({ carId: carId });

	if (deleteRes.deletedCount > 0 && deleteRes.acknowledged) {
		console.log('car deleted from db');
		return res.send('car deleted from db!');
	} else {
		console.log('car not deleted from db');
		return res.status(400).send('car not deleted from db');
	}
}

async function updateCar(req, res) {
	const Car = getCarModel();
	const rBody = req.body;
	const carId = req.query.car_id;

	const updateRes = await Car.findOneAndUpdate(
		{ carId: carId },
		u.newCarObj(rBody, carId),
		{ new: true },
	);

	if (updateRes.carId) {
		console.log('car update success');
		return res.send('car updated successfully');
	} else {
		console.log('car update failed', err);
		return res.status(400).send('car update failed');
	}
}

function login(req, res) {
	const pass = req.body.input;

	const data = { time: Date() };
	const token = jwt.sign(data, pass);

	try {
		const jwtSecretKey = process.env.JWT_SECRET_KEY;
		const verified = jwt.verify(token, jwtSecretKey);

		if (verified) return res.send(token);
		else return res.status(401).send('unauthorised');
	} catch (error) {
		return res.status(401).send('unauthorised');
	}
}

function verifyToken(req, res) {
	return res.send('authenticated!');
}

const LDSTKey = 'last_deployment_success_time';
const since = 'Apr 2024';
const first_car_date = '2012';

/**
 * `carId` is the add-time epoch (see AddCarForm: `Date.now()` = ms). Adds ISO `date_added`, drops `_id`.
 * @param {Record<string, unknown>} r
 */
function carDocWithDateAddedFromCarId(r) {
	const out = { ...r };
	let date_added = null;
	if (out.carId != null && out.carId !== '') {
		const n = Number(String(out.carId).trim());
		if (Number.isFinite(n) && n > 0) {
			// AddCarForm uses `Date.now()` (ms, ~1.7e12). Support 10-digit seconds if present.
			const ms = n < 1e12 ? n * 1000 : n;
			const d = new Date(ms);
			if (!Number.isNaN(d.getTime())) {
				date_added = d.toISOString();
			}
		}
	}
	out.date_added = date_added;
	delete out._id;
	return out;
}

/** $facet: counts per `segment` array value (a car with multiple tags counts in each). */
function countByAllSegmentTags() {
	return [
		{ $unwind: { path: '$segment', preserveNullAndEmptyArrays: false } },
		{ $match: { segment: { $ne: null, $ne: '' } } },
		{ $group: { _id: '$segment', count: { $sum: 1 } } },
		{ $sort: { count: -1, _id: 1 } },
		{ $project: { _id: 0, key: '$_id', count: 1 } },
	];
}

/**
 * Car keys in `segments` config to treat as premium / rarity (chase, TH, STH, …).
 * @returns {string[]}
 */
function getRaritySegmentKeys() {
	const v = u.getConfigValue('statsRaritySegmentKeys', null);
	if (Array.isArray(v) && v.length) {
		const f = v.filter(
			k => typeof k === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k),
		);
		if (f.length) return f;
	}
	return ['chase', 'treasurehunt'];
}

/**
 * $facet: like countByAllSegmentTags but only segment keys in `keys` (e.g. chase, TH).
 * @param {string[]} keys
 */
function countByRaritySegmentTags(keys) {
	if (!keys.length) {
		return [{ $match: { $expr: { $eq: [1, 0] } } }];
	}
	return [
		{ $unwind: { path: '$segment', preserveNullAndEmptyArrays: false } },
		{ $match: { segment: { $in: keys } } },
		{ $group: { _id: '$segment', count: { $sum: 1 } } },
		{ $sort: { count: -1, _id: 1 } },
		{ $project: { _id: 0, key: '$_id', count: 1 } },
	];
}

/**
 * @param {Array<{key: unknown, count: number}>|null|undefined} rows
 * @param {string[]} keys
 */
function mergeRarityWithZeros(rows, keys) {
	const m = new Map();
	for (const r of rows || []) {
		if (r && r.key != null) m.set(String(r.key), r.count);
	}
	return keys
		.map(k => ({ key: k, count: m.get(k) ?? 0 }))
		.sort(
			(a, b) =>
				b.count - a.count || String(a.key).localeCompare(String(b.key)),
		);
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

		// Netlify deploy notifications send a "deploy object" body. For a "Deploy succeeded"
		// notification, common shapes include event=deploy_succeeded and/or state=ready.
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

		// Only update the "last deployment success time" key when this looks like a success.
		// Still store the payload on success so you can inspect it later.
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

/**
 * Hero / shell: deploy uptime, static copy, and headline totals (cars, distinct series, distinct segments).
 * One aggregate — no by-type / rarity / recent list (those stay on GET /api/stats).
 */
async function getHomepageStats(req, res) {
	try {
		let lastDeploy = null;
		try {
			lastDeploy = await Settings.findOne({ key: LDSTKey }).lean();
		} catch (err) {
			console.log('getHomepageStats db read error', err?.message ?? err);
		}

		const time = lastDeploy?.time ?? lastDeploy?.payload?.created_at ?? null;
		const uptime = time ? u.formatUptime(time, new Date()) : null;

		let total_cars = null;
		let total_series = null;
		let total_segments = null;
		try {
			const Car = getCarModel();
			const agg = await Car.aggregate([
				{
					$facet: {
						totalCars: [{ $count: 'n' }],
						series: [
							{
								$match: {
									series: { $exists: true, $ne: null, $ne: '' },
								},
							},
							{ $group: { _id: '$series' } },
							{ $count: 'n' },
						],
						segments: [
							{
								$unwind: {
									path: '$segment',
									preserveNullAndEmptyArrays: false,
								},
							},
							{
								$match: {
									segment: { $ne: null, $ne: '' },
								},
							},
							{ $group: { _id: '$segment' } },
							{ $count: 'n' },
						],
					},
				},
			]).exec();

			const out = agg && agg[0] ? agg[0] : {};
			total_cars = out.totalCars?.[0]?.n ?? 0;
			total_series = out.series?.[0]?.n ?? 0;
			total_segments = out.segments?.[0]?.n ?? 0;
		} catch (err) {
			console.log('getHomepageStats car totals error', err?.message ?? err);
		}

		return res.send({
			uptime,
			since,
			first_car_date,
			total_cars,
			total_series,
			total_segments,
		});
	} catch (err) {
		console.log('getHomepageStats error', err);
		return res.send({
			uptime: null,
			since,
			first_car_date,
			total_cars: null,
			total_series: null,
			total_segments: null,
		});
	}
}

/**
 * Full collection analytics for the stats page: aggregates, breakdowns, recent list.
 */
async function getStats(req, res) {
	try {
		const Car = getCarModel();
		let lastDeploy = null;
		try {
			lastDeploy = await Settings.findOne({ key: LDSTKey }).lean();
		} catch (err) {
			console.log('getStats settings read error', err?.message ?? err);
		}

		let total_cars = null;
		let total_series = null;
		let total_segments = null;
		let by_type = null;
		let by_rarity = null;
		try {
			const rarityKeys = getRaritySegmentKeys();
			const agg = await Car.aggregate([
				{
					$facet: {
						totalCars: [{ $count: 'n' }],
						series: [
							{
								$match: {
									series: { $exists: true, $ne: null, $ne: '' },
								},
							},
							{ $group: { _id: '$series' } },
							{ $count: 'n' },
						],
						segments: [
							{
								$unwind: {
									path: '$segment',
									preserveNullAndEmptyArrays: false,
								},
							},
							{
								$match: {
									segment: { $ne: null, $ne: '' },
								},
							},
							{ $group: { _id: '$segment' } },
							{ $count: 'n' },
						],
						by_type: countByAllSegmentTags(),
						by_rarity: countByRaritySegmentTags(rarityKeys),
					},
				},
			]).exec();

			const out = agg && agg[0] ? agg[0] : {};
			total_cars = out.totalCars?.[0]?.n ?? 0;
			total_series = out.series?.[0]?.n ?? 0;
			total_segments = out.segments?.[0]?.n ?? 0;
			by_type = Array.isArray(out.by_type) ? out.by_type : [];
			by_rarity = mergeRarityWithZeros(
				Array.isArray(out.by_rarity) ? out.by_rarity : [],
				rarityKeys,
			);
		} catch (err) {
			console.log('getStats car aggregate error', err?.message ?? err);
		}

		const time = lastDeploy?.time ?? lastDeploy?.payload?.created_at ?? null;
		const uptime = time ? u.formatUptime(time, new Date()) : null;

		let recent_additions = null;
		try {
			const rawN = u.getConfigValue('statsRecentAddedCount', 8);
			const n = Math.min(
				32,
				Math.max(
					1,
					typeof rawN === 'number' && !Number.isNaN(rawN)
						? Math.floor(rawN)
						: parseInt(String(rawN), 10) || 8,
				),
			);
			const projection = u.getMaskedCarFields();
			const rows = await Car.find({}, projection)
				.sort({ carId: -1 })
				.limit(n)
				.lean();
			recent_additions = Array.isArray(rows)
				? rows.map(carDocWithDateAddedFromCarId)
				: [];
		} catch (err) {
			console.log('getStats recent_additions error', err?.message ?? err);
		}

		return res.send({
			uptime,
			since,
			first_car_date,
			total_cars,
			total_series,
			total_segments,
			by_type: by_type ?? null,
			by_rarity: by_rarity ?? null,
			recent_additions: recent_additions ?? null,
		});
	} catch (err) {
		console.log('getStats error', err);
		return res.send({
			uptime: null,
			since,
			first_car_date,
			total_cars: null,
			total_series: null,
			total_segments: null,
			by_type: null,
			by_rarity: null,
			recent_additions: null,
		});
	}
}

async function getRuntimeConfig(req, res) {
	try {
		// Ensure we have the latest cached DB config for current ENV.
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

exports.r = {
	logger,
	captureWebsiteVisit,
	getWebsiteVisitStats,
	authMiddleware,
	getAllMasked,
	getAll,
	addCar,
	uploadImage,
	getImageUrl,
	deleteCar,
	updateCar,
	login,
	verifyToken,
	netlifyDeploymentWebhook,
	getHomepageStats,
	getStats,
	getRuntimeConfig,
};
