const mongoose = require('mongoose');
const { config } = require('./config.js');

mongoose
	.connect(config.config.dbEndpoint)
	.then(() => console.log('db connected'))
	.catch(err => console.log(err));

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

const schema = getSchemaForFormItem(config.config.formItems);
schema['reqId'] = {
	type: String,
	required: true,
	unique: true,
};

const carSchema = mongoose.Schema(schema);
module.exports = mongoose.model('Car', carSchema);
