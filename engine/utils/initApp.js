const axios = require('axios');
const fs = require('fs');
const { initDb } = require('./db.js');

exports.initApp = async function (rootDir) {
	const assetsDir = rootDir + '/assets/';
	const configFile = rootDir + '/config/default.json';

	if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

	try {
		const response = await axios.get(
			'https://raw.githubusercontent.com/prtvi/hotwheeeels/master/body/src/config.json'
		);

		fs.writeFileSync(configFile, JSON.stringify(response.data));

		console.log('config initialised from api!');
	} catch (error) {
		console.log(
			error.code,
			'error calling config api, config from local file initialised'
		);
	} finally {
		initDb();
	}
};
