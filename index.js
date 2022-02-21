const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const cors = require('cors');
const history = require('connect-history-api-fallback');

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

//DB connection
/*
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.fr8f5.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log(`Connected to the database ${process.env.DBNAME}`))
    .catch(e => console.log('Error db:', e))*/

//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
//app.use(history());

//Routes
//app.use('/api/user', require('./routes/auth'));
//app.use('/api/dashboard', verifyToken, require('./routes/dashboard'));

//Static files folder
app.use(express.static(__dirname + "/public"));

//Starting server
app.listen(app.get(process.env.PORT), () => {
    console.log(`The backend server is listening at port: ${process.env.PORT}`)
})