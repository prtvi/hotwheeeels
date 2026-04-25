const axios = require('axios');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { initDb, initCarModel, getCarModel, Settings } = require('./db.js');

let dbConfig = null;
let dbConfigLoadedForEnv = null;

async function initApp() {
	console.log('engine env', getRuntimeEnv());

	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API_KEY,
		api_secret: process.env.CLOUD_API_SECRET,
	});

	initDb();
	await loadDbConfig();

	// Build Car model after DB config is available.
	initCarModel(getConfigValue('formItems', []));
}

function getRuntimeEnv() {
	return process.env.ENV || 'prod';
}

async function loadDbConfig() {
	const env = getRuntimeEnv();
	if (dbConfigLoadedForEnv === env) return dbConfig;

	try {
		const doc = await Settings.findOne({ key: `config_${env}` }).lean();
		dbConfig = doc?.payload ?? null;
		dbConfigLoadedForEnv = env;
		return dbConfig;
	} catch (err) {
		console.log('loadDbConfig error', err?.message ?? err);
		dbConfig = null;
		dbConfigLoadedForEnv = env;
		return null;
	}
}

function getConfigValue(k, fallback) {
	if (dbConfig && Object.prototype.hasOwnProperty.call(dbConfig, k))
		return dbConfig[k];
	return fallback;
}

function getDbConfig() {
	return dbConfig;
}

async function makeRequest(url, requestBody, headers) {
	try {
		if (requestBody === undefined) return await axios.get(url);
		else return await axios.post(url, requestBody, headers);
	} catch (error) {
		return error;
	}
}

function newCarObj(reqBody, carId) {
	const formItems = getConfigValue('formItems', []);
	const carObj = {};
	carObj['carId'] = carId;

	for (let i = 0; i < formItems.length-1; i++) { // -1 to exclude the btn component
		const fi = formItems[i];
		const key = fi.key;
		const value = reqBody[key];

		let valueToAttach;
		let ignore;

		switch (fi.inputType) {
			case 'text':
			case 'textarea':
			case 'date':
			case 'array':
				valueToAttach = value;
				break;

			case 'number':
				valueToAttach = +value;
				break;

			case 'checkbox':
				valueToAttach = value === 'on';
				break;

			default:
				ignore = true;
				break;
		}

		if (!ignore) carObj[key] = valueToAttach;
	}

	return carObj;
}

function getMaskedCarFields() {
	const formItems = getConfigValue('formItems', []);
	const fields = {};

	// add the carId too
	fields['carId'] = 1;

	for (let i = 0; i < formItems.length-1; i++) { // -1 to exclude the btn component
		const fi = formItems[i];

		if (fi.forAuthOnly) continue;
		else fields[fi.key] = 1;
	}

	return fields;
}

async function deletePicturesForCarId(carId) {
	const Car = getCarModel();
	const results = await Car.aggregate([
		{ $match: { carId: carId } },
		{ $project: { _id: 0, n: { $size: '$imgs' } } },
	]).exec();

	if (results.length === 0) return 'nothing to delete for carId: ' + carId;

	const nImages = results[0].n;
	if (nImages === 0) return 'nothing to delete for carId: ' + carId;

	const msgs = [];
	const folder = getCloudinaryFolder();

	for (let i = 0; i < nImages; i++) {
		const img = `${folder}/img_${carId}_${i}`;

		const res = await cloudinary.uploader.destroy(img);
		console.log(res);

		msgs.push(res.result);
	}

	return msgs;
}

async function convertCompressAndReturnImageBuffer(buffer) {
	const sharpInstance = sharp(buffer);

	const metadata = await sharpInstance.metadata();
	if (metadata.width > 1000) {
		return sharpInstance
			.resize(1024, null)
			.webp({ quality: 50 })
			.toBuffer();
	}

	// { quality: 20 outta 100, lossless: true }
	return sharpInstance.webp({ quality: 20 }).toBuffer();
}

function bufferToStream(buffer) {
	const readable = new Readable({
		read() {
			this.push(buffer);
			this.push(null);
		},
	});
	return readable;
}

function getEngineURL() {
	return getConfigValue('engineURL', 'https://hotwheeeelsengine.onrender.com');
}

function getCloudinaryFolder() {
	return `hotwheeeels/${getRuntimeEnv()}`;
}

function formatUptime(fromDate, toDate) {
	const from = new Date(fromDate);
	const to = new Date(toDate);
	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
	if (to.getTime() < from.getTime()) return '-';

	let totalMonths =
		(to.getFullYear() - from.getFullYear()) * 12 +
		(to.getMonth() - from.getMonth());

	// If we haven't reached the day-of-month yet, subtract a month.
	if (to.getDate() < from.getDate()) totalMonths -= 1;
	if (totalMonths < 0) totalMonths = 0;

	// < 1 month: show days only.
	if (totalMonths < 1) {
		const ms = to.getTime() - from.getTime();
		const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
		return `${days}d`;
	}

	// < 1 year: show months + days.
	if (totalMonths < 12) {
		const monthAnchor = new Date(from);
		monthAnchor.setMonth(monthAnchor.getMonth() + totalMonths);
		const msRemainder = to.getTime() - monthAnchor.getTime();
		const daysRemainder = Math.max(
			0,
			Math.floor(msRemainder / (1000 * 60 * 60 * 24)),
		);
		return `${totalMonths}m ${daysRemainder}d`;
	}

	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;
	return `${years}y ${months}m`;
}

exports.u = {
	initApp,
	deletePicturesForCarId,
	newCarObj,
	getMaskedCarFields,
	convertCompressAndReturnImageBuffer,
	bufferToStream,
	makeRequest,
	getEngineURL,
	getCloudinaryFolder,
	formatUptime,
	loadDbConfig,
	getConfigValue,
	getDbConfig,
};
