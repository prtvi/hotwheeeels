const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { r } = require('./utils/controller.js');
const { initApp } = require('./utils/initApp.js');

dotenv.config();
const PORT = process.env.PORT || 3001;
initApp(__dirname);

const app = express();

app.use(express.static(__dirname + '/'));
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(r.logger);

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/api/add_car', r.addCar);
app.post('/api/image_upload', r.uploadImage);
app.get('/api/get_all', r.getAll);
app.get('/api/delete_car', r.deleteCar);
app.post('/api/update_car', r.updateCar);

app.listen(PORT, () =>
	console.log(`------ Engine running on port ${PORT} ------`)
);
