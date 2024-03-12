const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/add_car', (req, res) => {
	const reqId = req.query.req_id;
	console.log(reqId);
	console.log(req.body);

	res.send('accepted');
});

app.post('/api/image_upload', (req, res) => {
	const file = req.files.image;

	const reqId = req.query.req_id;
	console.log(reqId);

	console.log(file.name);

	file.mv('./assets/' + file.name, err => {
		if (err) return res.status(500).send(err);
	});

	res.send('image uploaded successfully');
});

app.listen(PORT, () => console.log(`Engine app running on port ${PORT}`));
