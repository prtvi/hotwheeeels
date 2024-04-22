const axios = require('axios');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const config = require('config');
const { Readable } = require('stream');
const { initDb } = require('./db.js');
const { Car } = require('./db.js');

async function makeRequest(url, requestBody) {
	try {
		if (requestBody === undefined) {
			return await axios.get(url);
		} else {
			return await axios.post(url, requestBody);
		}
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

async function deletePicturesForCarId(carId) {
	const results = await Car.aggregate([
		{ $match: { carId: carId } },
		{ $project: { _id: 0, n: { $size: '$imgs' } } },
	]).exec();

	if (results.length === 0) return;

	const folder = config.get('ENV');
	const nImages = results[0].n;
	for (let i = 0; i < nImages; i++) {
		const img = `${folder}/img_${carId}_${i}`;

		const res = await cloudinary.uploader.destroy(img);
		console.log(res);
	}
}

async function compressAndReturnBuffer(buffer) {
	return sharp(buffer).webp({ quality: 20 }).toBuffer();
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
	compressAndReturnBuffer,
	bufferToStream,
	makeRequest,
};
