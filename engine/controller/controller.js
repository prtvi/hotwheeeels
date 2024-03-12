const Car = require('../model/db.js');

function addCar(req, res) {
	const rBody = req.body;
	const reqId = req.query.req_id;

	f();

	async function f() {
		const result = await Car.find();
		const count = await result.length;

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
			imgSrc: 'test.png',
			reqId: reqId,
			carNum: count + 1,
		});

		newCar
			.save()
			.then(() => {
				console.log('saved car!');
				res.send('saved new car');
				return;
			})
			.catch(err => {
				console.log('error on saving car', err);
				res.status(500).send(err);
				return;
			});
	}
}

function uploadImage(req, res) {
	const file = req.files.imgSrc;
	const reqId = req.query.req_id;

	file.mv('./assets/' + file.name, err => {
		if (err) return res.status(500).send(err);
	});

	Car.findOneAndUpdate(
		{
			reqId: reqId,
		},
		{
			imgSrc: './hw/engine/assets/' + file.name,
		}
	)
		.then(() => {
			console.log('success');
			return res.send('image uploaded successfully');
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send('image upload failed');
		});
}

function getAll(req, res) {
	Car.find()
		.then(cars => {
			console.log(cars);
			return res.send(cars);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send(err);
		});
}

exports.r = {
	addCar,
	uploadImage,
	getAll,
};
