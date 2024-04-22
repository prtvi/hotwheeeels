const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const config = require('config');
const { r } = require('./utils/controller.js');
const { u } = require('./utils/util.js');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
u.initApp();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(r.logger);

app.get('/', (req, res) => res.send('hello world!'));
app.get('/api/get_all', r.getAll);

app.post('/api/add_car', r.addCar);

app.post(
	'/api/image_upload',
	upload.array('imgs', config.get('maxFileUploadLimit')),
	r.uploadImage
);
app.post('/api/internal/get_img_url', upload.single('img'), r.imageUrl);

app.get('/api/delete_car', r.deleteCar);
app.post('/api/update_car', r.updateCar);

app.post('/api/login', r.login);
app.post('/api/verify_token', r.verifyToken);

app.listen(PORT, () =>
	console.log(`------ engine running on port ${PORT} ------`)
);
