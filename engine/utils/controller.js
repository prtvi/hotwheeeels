const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Car } = require('./db.js');

function logger(req, res, next) {
	console.log(req.url);
	next();
}

function addCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;

	const car = new Car(newCarObj(rBody, carId));
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

function uploadImage(req, res) {
	const fileInput = req.files;
	const carId = req.query.car_id;

	if (!fileInput || Object.keys(fileInput).length === 0)
		return res.status(400).send('No files were uploaded.');

	deletePicturesForCarId(carId);

	const images = [];
	const fileRefKeys = Object.keys(fileInput);

	for (let i = 0; i < fileRefKeys.length; i++) {
		const fileRefKey = fileRefKeys[i];
		const file = fileInput[fileRefKey];

		const fileNameParts = file.name.split('.');
		const extension = '.' + fileNameParts[fileNameParts.length - 1];

		const newFilePath = config.get('assetsDir') + fileRefKey + extension;

		file.mv(newFilePath, err => {
			if (err) {
				console.log('ERROR', err);
				return res.status(400).send(err);
			}
		});

		const absUrl =
			config.get('engineURL').replace('hotwheeeelsengine', '') +
			newFilePath.slice(2);

		images.push(absUrl);
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

function getAll(req, res) {
	Car.find()
		.then(cars => {
			const result = [];
			cars.forEach(car => {
				car.price = 0;
				result.push(car);
			});
			res.send(result);
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		});
}

function deleteCar(req, res) {
	const carId = req.query.car_id;

	deletePicturesForCarId(carId);

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

	Car.findOneAndUpdate({ carId: carId }, newCarObj(rBody, carId))
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
		console.log(verified);

		if (verified) return res.send('authenticated!');
		else return res.status(401).send('unauthorised');
	} catch (error) {
		console.log('unauthorised');
		return res.status(401).send('unauthorised');
	}
}

exports.r = {
	logger,
	addCar,
	uploadImage,
	getAll,
	deleteCar,
	updateCar,
	login,
	verifyToken,
};

function deletePicturesForCarId(carId) {
	const files = fs
		.readdirSync(config.get('assetsDir'))
		.filter(
			allFilesPaths => allFilesPaths.match(`img_${carId}_*`) !== null
		);

	if (files.length === 0) return false;

	files.forEach(f => {
		fp = `${config.get('assetsDir')}${f}`;
		fs.unlinkSync(fp);
		console.log('delete file:', fp);
	});

	return true;
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
