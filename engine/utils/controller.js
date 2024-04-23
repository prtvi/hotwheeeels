const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const config = require('config');
const { u } = require('./util.js');
const { Car } = require('./db.js');

function logger(req, res, next) {
	console.log(req.method, req.url);
	next();
}

function authMiddleware(req, res, next) {
	const token = req.headers.token;
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const verified = jwt.verify(token, jwtSecretKey);

		if (verified) return next();
		else return res.status(401).send('unauthorised');
	} catch (error) {
		return res.status(401).send('unauthorised');
	}
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
			console.log('car saved in db');
			return res.send('car saved in db');
		})
		.catch(err => {
			console.log('error saving car', err);
			return res.status(400).send('error saving car');
		});
}

async function uploadImage(req, res) {
	const fileInput = req.files;
	const carId = req.query.car_id;

	const nFiles = fileInput.length;
	if (!fileInput || nFiles === 0)
		return res.status(400).send('no files were uploaded.');

	const deleteImgSuccess = await u.deletePicturesForCarId(carId);
	console.log('image delete success:', deleteImgSuccess);

	const images = [];
	for (let i = 0; i < nFiles; i++) {
		const file = fileInput[i];

		const fd = new FormData();
		fd.append('img', new Blob([file.buffer]), file.originalname);

		const url =
			config.get('ENV') === 'prod'
				? config.get('engineURL')
				: config.get('engineURLDev') + '/api/auth/get_img_url';

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
			{ new: true }
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

			console.log(result.secure_url);
			return res.send(result.secure_url);
		}
	);

	u.bufferToStream(buffer).pipe(stream);
}

async function deleteCar(req, res) {
	const carId = req.body.car_id;

	const deleteImgSuccess = await u.deletePicturesForCarId(carId);
	console.log('image delete success:', deleteImgSuccess);

	const deleteRes = await Car.deleteOne({ carId: carId });

	if (deleteRes.deletedCount > 0 && deleteRes.acknowledged) {
		console.log('car deleted from db');
		return res.send('car deleted from db!');
	} else {
		console.log('car not deleted from db', err);
		return res.status(400).send('car not deleted from db');
	}
}

async function updateCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;

	const updateRes = await Car.findOneAndUpdate(
		{ carId: carId },
		u.newCarObj(rBody, carId),
		{ new: true }
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
	const jwtSecretKey = req.body.input;
	const data = { time: Date() };

	const token = jwt.sign(data, jwtSecretKey);
	res.send(token);
}

function verifyToken(req, res) {
	return res.send('authenticated!');
}

exports.r = {
	logger,
	authMiddleware,
	getAll,
	addCar,
	uploadImage,
	getImageUrl,
	deleteCar,
	updateCar,
	login,
	verifyToken,
};
