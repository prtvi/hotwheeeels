const axios = require('axios');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const convert = require('heic-convert');
const config = require('config');
const { Readable } = require('stream');
const { initDb } = require('./db.js');
const { Car } = require('./db.js');

async function makeRequest(url, requestBody, headers) {
	try {
		if (requestBody === undefined) return await axios.get(url);
		else return await axios.post(url, requestBody, headers);
	} catch (error) {
		return error;
	}
}

async function initApp() {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API_KEY,
		api_secret: process.env.CLOUD_API_SECRET,
	});

	initDb();
}

function newCarObj(reqBody, carId) {
	const formItems = config.get('formItems');
	const carObj = {};
	carObj['carId'] = carId;

	for (let i = 0; i < formItems.length; i++) {
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
	const formItems = config.get('formItems');
	const fields = {};

	// add the carId too
	fields['carId'] = 1;

	for (let i = 0; i < formItems.length; i++) {
		const fi = formItems[i];

		if (fi.forAuthOnly) continue;
		else fields[fi.key] = 1;
	}

	return fields;
}

async function deletePicturesForCarId(carId) {
	const results = await Car.aggregate([
		{ $match: { carId: carId } },
		{ $project: { _id: 0, n: { $size: '$imgs' } } },
	]).exec();

	if (results.length === 0) return 'nothing to delete for carId: ' + carId;

	const nImages = results[0].n;
	if (nImages === 0) return 'nothing to delete for carId: ' + carId;

	const msgs = [];
	const folder = config.get('ENV');

	for (let i = 0; i < nImages; i++) {
		const img = `${folder}/img_${carId}_${i}`;

		const res = await cloudinary.uploader.destroy(img);
		console.log(res);

		msgs.push(res.result);
	}

	return msgs;
}

async function convertCompressAndReturnImageBuffer(buffer) {
	const outputBuffer = await convert({
		buffer: buffer,
		format: 'PNG',
	});

	const sharpInstance = sharp(outputBuffer);

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

exports.u = {
	initApp,
	deletePicturesForCarId,
	newCarObj,
	getMaskedCarFields,
	convertCompressAndReturnImageBuffer,
	bufferToStream,
	makeRequest,
};
