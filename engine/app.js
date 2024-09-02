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

const mufl = config.get('maxFileUploadLimit');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(r.logger);

app.get('/', (req, res) => res.send('hello world!'));
app.post('/api/capture_website_visit', r.captureWebsiteVisit);
app.get('/api/get_website_visit_stats', r.getWebsiteVisitStats);
app.get('/api/get_all', r.getAllMasked);
app.post('/api/login', r.login);

app.use('/api/auth', r.authMiddleware);
app.get('/api/auth/get_all', r.getAll);
app.post('/api/auth/verify_token', r.verifyToken);
app.post('/api/auth/add_car', r.addCar);
app.post('/api/auth/image_upload', upload.array('imgs', mufl), r.uploadImage);
app.post('/api/auth/get_img_url', upload.single('img'), r.getImageUrl);
app.post('/api/auth/delete_car', r.deleteCar);
app.post('/api/auth/update_car', r.updateCar);

app.listen(PORT, () => console.log(`engine running on port ${PORT}`));
