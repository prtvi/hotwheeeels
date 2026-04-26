const jwt = require('jsonwebtoken');

function logger(req, res, next) {
	console.log(req.method, req.url);
	next();
}

function authMiddleware(req, res, next) {
	const token = req.headers.token;
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const verified = jwt.verify(token, jwtSecretKey);

		console.log('authenticated');
		if (verified) return next();
		else return res.status(401).send('unauthorised');
	} catch (error) {
		console.log('unauthourised');
		return res.status(401).send('unauthorised');
	}
}

function login(req, res) {
	const pass = req.body.input;

	const data = { time: Date() };
	const token = jwt.sign(data, pass);

	try {
		const jwtSecretKey = process.env.JWT_SECRET_KEY;
		const verified = jwt.verify(token, jwtSecretKey);

		if (verified) return res.send(token);
		else return res.status(401).send('unauthorised');
	} catch (error) {
		return res.status(401).send('unauthorised');
	}
}

function verifyToken(req, res) {
	return res.send('authenticated!');
}

module.exports = {
	logger,
	authMiddleware,
	login,
	verifyToken,
};
