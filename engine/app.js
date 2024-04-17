const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const { r } = require('./utils/controller.js');
const { initApp } = require('./utils/initApp.js');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
initApp(__dirname);

const app = express();

app.use(express.static(__dirname + '/'));
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(r.logger);

app.get('/hotwheeeelsengine/', (req, res) => res.send('Hello World!'));
app.post('/hotwheeeelsengine/api/add_car', r.addCar);
app.post('/hotwheeeelsengine/api/image_upload', r.uploadImage);
app.get('/hotwheeeelsengine/api/get_all', r.getAll);
app.get('/hotwheeeelsengine/api/delete_car', r.deleteCar);
app.post('/hotwheeeelsengine/api/update_car', r.updateCar);
app.post('/hotwheeeelsengine/api/login', r.login);
app.post('/hotwheeeelsengine/api/verify_token', r.verifyToken);

app.listen(PORT, () =>
	console.log(`------ Engine running on port ${PORT} ------`)
);
