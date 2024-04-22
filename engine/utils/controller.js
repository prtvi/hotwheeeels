const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const config = require('config');
const { u } = require('./util.js');
const { Car } = require('./db.js');

function logger(req, res, next) {
	console.log(req.url);
	next();
}

async function getAll(req, res) {
	try {
		const results = await Car.find();
		return res.send(results);
	} catch (err) {
		console.log(err);
		return res.status(400).send(err);
	}
}

function addCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;

	const car = new Car(u.newCarObj(rBody, carId));
	car.save()
		.then(() => {
			console.log('saved car!');
			return res.send('saved car!');
		})
		.catch(err => {
			console.log('error on saving car', err);
			return res.status(400).send(err);
		});
}

async function uploadImage(req, res) {
	const fileInput = req.files;
	const carId = req.query.car_id;

	const nFiles = fileInput.length;
	if (!fileInput || nFiles === 0)
		return res.status(400).send('No files were uploaded.');

	u.deletePicturesForCarId(carId);

	const images = [];
	for (let i = 0; i < nFiles; i++) {
		const file = fileInput[i];

		const fd = new FormData();
		fd.append('img', new Blob([file.buffer]), file.originalname);

		const url =
			config.get('ENV') === 'prod'
				? config.get('engineURL')
				: config.get('engineURLDev') + '/api/internal/get_img_url';

		const response = await u.makeRequest(url, fd);
		if (response.status === 200) images.push(response.data);
	}

	Car.findOneAndUpdate({ carId: carId }, { imgs: images })
		.then(() => {
			console.log('image upload success');
			return res.send('images uploaded successfully');
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send('images upload failed');
		});
}

async function imageUrl(req, res) {
	const file = req.file;
	const fnparts = file.originalname.split('.');
	const fileNameWoExt = fnparts.slice(0, fnparts.length - 1).join('');

	const buffer = await u.compressAndReturnBuffer(file.buffer);
	const stream = cloudinary.uploader.upload_stream(
		{
			folder: config.get('ENV'),
			public_id: fileNameWoExt,
			use_filename: true,
			overwrite: true,
		},
		(error, result) => {
			if (error) return res.status(500).send(error);
			return res.send(result.secure_url);
		}
	);

	u.bufferToStream(buffer).pipe(stream);
}

function deleteCar(req, res) {
	const carId = req.query.car_id;

	u.deletePicturesForCarId(carId);

	Car.deleteOne({ carId: carId })
		.then(() => {
			console.log('car deleted from db');
			res.send('car deleted from db!');
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		});
}

function updateCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;

	Car.findOneAndUpdate({ carId: carId }, u.newCarObj(rBody, carId))
		.then(() => {
			console.log('car update success');
			return res.send('car updated successfully');
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send('car update failed');
		});
}

function login(req, res) {
	const jwtSecretKey = req.body.input;
	const data = { time: Date() };

	const token = jwt.sign(data, jwtSecretKey);
	res.send(token);
}

function verifyToken(req, res) {
	const token = req.body.token;
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const verified = jwt.verify(token, jwtSecretKey);

		if (verified) return res.send('authenticated!');
		else return res.status(401).send('unauthorised');
	} catch (error) {
		return res.status(401).send('unauthorised');
	}
}

exports.r = {
	logger,
	getAll,
	addCar,
	uploadImage,
	imageUrl,
	deleteCar,
	updateCar,
	login,
	verifyToken,
};
