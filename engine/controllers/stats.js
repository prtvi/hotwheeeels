const { u } = require('../utils/util.js');
const { getCarModel, Settings } = require('../utils/db.js');
const { LDSTKey } = require('./config.js');

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
			const n = u.getConfigValue('statsRecentAddedCount', 8);
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

module.exports = {
	getHomepageStats,
	getStats,
};
