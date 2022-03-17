const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Custom imports
//const verifyToken = require('./middlewares/validate-token');
require('dotenv').config()

const app = express();

//Settings
//app.set('port', process.env.PORT || 3000);

const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3050',
    'http://localhost:3003',
    'http://localhost:3004',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
//app.options('*', cors())
//app.use(history());

//Routes
app.use('/', require('./routes/clients'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/devices'));
app.use('/', require('./routes/location'));
app.use('/', require('./routes/consumption'))
app.use('/', require('./routes/plug'))

//Static files folder
app.use(express.static(__dirname + "/public"));
/*
app.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS'
})*/

//Starting server
app.listen(app.get(process.env.PORT) || 3000, () => {
    console.log(`The backend server is listening at port: ${process.env.PORT}`)
})