const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { r } = require('./utils/controller.js');
const { initApp } = require('./utils/initApp.js');
const storage = multer.memoryStorage();
const upload = multer({ storage });
require('dotenv').config();

const PORT = process.env.PORT || 3001;
initApp(__dirname);

const app = express();

app.use('/assets', express.static('assets'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(r.logger);

app.get('/', (req, res) => res.send('hello world!'));
app.get('/api/get_all', r.getAll);

app.post('/api/add_car', r.addCar);
app.post('/api/image_upload', upload.array('imgs', 5), r.uploadImage);
app.get('/api/delete_car', r.deleteCar);
app.post('/api/update_car', r.updateCar);
app.post('/api/login', r.login);
app.post('/api/verify_token', r.verifyToken);

app.listen(PORT, () =>
	console.log(`------ Engine running on port ${PORT} ------`)
);
