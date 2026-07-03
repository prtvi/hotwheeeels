const mongoose = require('mongoose');

exports.initDb = function () {
	const dbUrl =
		process.env.ENV === 'prod'
			? process.env.DB_URL
			: process.env.DB_URL_DEV;

	if (!dbUrl) {
		console.log('db url missing; skipping db connect');
		return mongoose.connection;
	}

	mongoose
		.connect(dbUrl)
		.catch(err =>
			console.error('db connection failed:', err?.message ?? err),
		);

	const conn = mongoose.connection;
	conn.on('connected', () => console.log('db connected'));
	conn.on('disconnected', () => console.log('db disconnected'));
	conn.on('error', console.error.bind(console, 'connection error:'));

	return conn;
};

function getSchemaForFormItem(formItems) {
	const schema = {};

	for (let i = 0; i < formItems.length-1; i++) { // -1 to exclude the btn component
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
			case 'array':
			case 'select':
			case 'multioption':
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

let CarModel = null;

function initCarModel(formItems) {
	if (CarModel) return CarModel;
	const schema = getSchemaForFormItem(formItems || []);
	CarModel = mongoose.model('Car', mongoose.Schema(schema));
	return CarModel;
}

function getCarModel() {
	if (!CarModel) throw new Error('Car model not initialised');
	return CarModel;
}

const settingsSchema = {
	key: {
		type: String,
		required: true,
		unique: true,
	},
	status: {
		type: String,
		required: false,
	},
	time: {
		type: Date,
		required: false,
	},
	ts: {
		type: Number,
		required: false,
	},
	payload: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
	},
};

exports.Settings = new mongoose.model(
	'Settings',
	mongoose.Schema(settingsSchema),
);

exports.initCarModel = initCarModel;
exports.getCarModel = getCarModel;
