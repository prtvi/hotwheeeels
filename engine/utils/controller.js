const Car = require('./db.js');
const { config } = require('./config.js');

function addCar(req, res) {
	const rBody = req.body;
	const reqId = req.query.req_id;

	const newCar = new Car({
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
		giftedby: rBody.giftedby,
		coll: rBody.coll,
		year: rBody.year,
		series: rBody.series,
		baseColorAndType: rBody.baseColorAndType,
		windowColor: rBody.windowColor,
		interiorColor: rBody.interiorColor,
		toy: rBody.toy,
		notes: rBody.notes,
		imgs: [],
		reqId: reqId,
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
	const reqId = req.query.req_id;

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

	Car.findOneAndUpdate({ reqId: reqId }, { imgs: images })
		.then(() => {
			console.log('success');
			return res.send('image uploaded successfully');
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send('image upload failed');
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
	const carId = req.query.carId;
	console.log(carId);

	Car.deleteOne({ _id: carId })
		.then(() => {
			console.log('car deleted');
			res.send('car deleted!');
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		});
}

exports.r = {
	addCar,
	uploadImage,
	getAll,
	deleteCar,
};
