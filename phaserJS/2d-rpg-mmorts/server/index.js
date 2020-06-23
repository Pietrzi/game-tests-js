require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const routes = require('./routes/main');
const passwordRoutes = require('./routes/password');

// setup mongo connection
const uri = process.env.MONGO_CONNEECTION_URI;
const mongoConfig = {
    useNewUrlParser: true ,
    useCreateIndex: true,
    useUnifiedTopology: true
};
mongoose.connect(uri, mongoConfig);

mongoose.connection.on('error', error => {
    console.log(error);
    process.exit(1);
})

mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
})

const app = express();
const port = process.env.PORT || 3000;

// update express settings
app.use(bodyParser.urlencoded({extended: false})); // parse app/x-www-form-urlencoded
app.use(bodyParser.json()); // parse app/json
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN })); // cors to use another server API

require('./auth/auth');

// setup routes
app.use('/', routes);
app.use('/', passwordRoutes);

// middleware
// catch all other routes
app.use((req, res) => {
    res.status(404).json({ message: '404 - Not Found', status: 404 })
})

// handle errors
app.use((error, req, res, next) => {
    consnole.log(error);
    res.status(error.status || 500).json({ error: error.message, status: 500 })
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})