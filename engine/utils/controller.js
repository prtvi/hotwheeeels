const Car = require('./db.js');
const { config } = require('./config.js');

function addCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;

	const newCar = new Car({
		carId: carId,
		carName: rBody.carName,
		brand: rBody.brand,
		price: +rBody.price,
		color: rBody.color,
		acquiredDate: rBody.acquiredDate,
		purchasedFrom: rBody.purchasedFrom,
		orderNumber: rBody.orderNumber,
		carType: rBody.carType,
		cardAvailable: rBody.cardAvailable === 'on',
		isGift: rBody.isGift === 'on',
		giftedBy: rBody.giftedBy,
		coll: rBody.coll,
		year: rBody.year,
		series: rBody.series,
		baseColorAndType: rBody.baseColorAndType,
		windowColor: rBody.windowColor,
		interiorColor: rBody.interiorColor,
		toy: rBody.toy,
		notes: rBody.notes,
		imgs: [],
	});

	newCar
		.save()
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

	const images = [];
	const fileRefKeys = Object.keys(fileInput);

	for (let i = 0; i < fileRefKeys.length; i++) {
		const fileRefKey = fileRefKeys[i];
		const file = fileInput[fileRefKey];

		const fileNameParts = file.name.split('.');
		const extension = '.' + fileNameParts[fileNameParts.length - 1];

		const newFilePath = './assets/' + fileRefKey + extension;
		// console.log(newFilePath);

		file.mv(newFilePath, err => {
			if (err) {
				console.log('ERROR', err);
				return res.status(400).send(err);
			}
		});

		const absUrl = config.config.engineURL + '/' + newFilePath.slice(2);
		// console.log(absUrl);

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
		.then(cars => res.send(cars))
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
}

function deleteCar(req, res) {
	const carId = req.query.car_id;
	console.log(carId);

	Car.deleteOne({ carId: carId })
		.then(() => {
			console.log('car deleted');
			res.send('car deleted!');
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		});

	// TODO: delete the images: img_carId_idx
}

function updateCar(req, res) {
	const rBody = req.body;
	const carId = req.query.car_id;
	console.log(rBody);

	Car.findOneAndUpdate(
		{ carId: carId },
		{
			carName: rBody.carName,
			brand: rBody.brand,
			price: +rBody.price,
			color: rBody.color,
			acquiredDate: rBody.acquiredDate,
			purchasedFrom: rBody.purchasedFrom,
			orderNumber: rBody.orderNumber,
			carType: rBody.carType,
			cardAvailable: rBody.cardAvailable === 'on',
			isGift: rBody.isGift === 'on',
			giftedBy: rBody.giftedBy,
			coll: rBody.coll,
			year: rBody.year,
			series: rBody.series,
			baseColorAndType: rBody.baseColorAndType,
			windowColor: rBody.windowColor,
			interiorColor: rBody.interiorColor,
			toy: rBody.toy,
			notes: rBody.notes,
		}
	)
		.then(() => {
			console.log('car update success');
			return res.send('car updated successfully');
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send('car update failed');
		});
}

exports.r = {
	addCar,
	uploadImage,
	getAll,
	deleteCar,
	updateCar,
};
