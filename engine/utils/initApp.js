const axios = require('axios');
const fs = require('fs');
const { initDb } = require('./db.js');

exports.initApp = async function (rootDir) {
	const response = await axios.get(
		'https://raw.githubusercontent.com/prtvi/hotwheeeels/master/body/src/config.json'
	);

	const assetsDir = rootDir + '/assets/';
	const configFile = rootDir + '/config/default.json';

	const conf = response.data;
	// console.log(conf);

	let path = assetsDir;
	if (!fs.existsSync(path)) fs.mkdirSync(path);

	path = configFile;
	fs.writeFileSync(path, JSON.stringify(conf));

	console.log('config initialised!');
	initDb();
};
