const fs = require('fs');
const { initDb } = require('./db.js');

exports.initApp = async function (rootDir) {
	const assetsDir = rootDir + '/assets/';
	if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

	initDb();
};
