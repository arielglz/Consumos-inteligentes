const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Custom imports
//const verifyToken = require('./middlewares/validate-token');
require('dotenv').config()

const app = express();

//Settings
//app.set('port', process.env.PORT || 3000);
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
//app.use(history());

//Routes
app.use('/', require('./routes/clients'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/devices'));
app.use('/', require('./routes/location'));

//Static files folder
app.use(express.static(__dirname + "/public"));

//Starting server
app.listen(app.get(process.env.PORT) || 3000, () => {
    console.log(`The backend server is listening at port: ${process.env.PORT}`)
})