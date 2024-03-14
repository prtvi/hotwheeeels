const fs = require('fs');

const config = JSON.parse(fs.readFileSync('../body/src/config.json', 'utf8'));

exports.config = { config };
