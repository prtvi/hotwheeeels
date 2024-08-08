const mongoose = require('mongoose');
const config = require('config');

exports.initDb = function () {
	const dbUrl =
		config.get('ENV') === 'prod'
			? process.env.DB_URL
			: process.env.DB_URL_DEV;

	console.log('db connecting to', dbUrl);
	mongoose.connect(dbUrl);

	const conn = mongoose.connection;
	conn.on('connected', () => console.log('db connected'));
	conn.on('disconnected', () => console.log('db disconnected'));
	conn.on('error', console.error.bind(console, 'connection error:'));

	return conn;
};

function getSchemaForFormItem(formItems) {
	const schema = {};

	for (let i = 0; i < formItems.length; i++) {
		const fi = formItems[i];

		let fieldType = '';
		let ignore = false;

		switch (fi.inputType) {
			case 'text':
			case 'textarea':
			case 'date':
				fieldType = String;
				break;

			case 'number':
				fieldType = Number;
				break;

			case 'checkbox':
				fieldType = Boolean;
				break;

			case 'file':
				fieldType = Array;
				break;

			default:
				ignore = true;
				break;
		}

		if (ignore) continue;

		schema[fi.key] = {
			type: fieldType,
			required: fi.required,
		};
	}

	schema['carId'] = {
		type: String,
		required: true,
		unique: true,
	};

	return schema;
}

// let Car;
// if (config.get('ENV') === 'dev')
// 	Car = new mongoose.model('car_dev', mongoose.Schema(schema));
// else Car = new mongoose.model('Car', mongoose.Schema(schema));

const schema = getSchemaForFormItem(config.get('formItems'));
exports.Car = new mongoose.model('Car', mongoose.Schema(schema));
