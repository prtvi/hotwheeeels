const mongoose = require('mongoose');
const config = require('config');

exports.initDb = function () {
	mongoose.connect(process.env.DB_URL);

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

	return schema;
}

const schema = getSchemaForFormItem(config.get('formItems'));
schema['carId'] = {
	type: String,
	required: true,
	unique: true,
};

exports.Car = new mongoose.model('Car', mongoose.Schema(schema));
