const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4())
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(multer({
    storage: storage, fileFilter: fileFilter
}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use(chatRoutes);



app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({ message: message, data: data });
});

const server = app.listen(8080);
const io = require('./socket').init (server);
io.on('connection', socekt => {
    //socket = connection between server and client
    console.log('client connected')
})

