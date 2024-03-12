const mongoose = require('mongoose');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('../body/src/config.json', 'utf8'));

mongoose
	.connect(config.dbEndpoint)
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
			case 'file':
				fieldType = String;
				break;

			case 'number':
				fieldType = Number;
				break;

			case 'checkbox':
				fieldType = Boolean;
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

const schema = getSchemaForFormItem(config.formItems);
schema['reqId'] = {
	type: String,
	required: true,
	unique: true,
};
schema['carNum'] = {
	type: Number,
	required: true,
	unique: true,
};

const carSchema = mongoose.Schema(schema);
module.exports = mongoose.model('Car', carSchema);
