const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authentication');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use(authRoutes);

app.listen(8080);