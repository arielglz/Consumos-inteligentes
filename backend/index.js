const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const moment = require('moment');

//Custom imports
//const verifyToken = require('./middlewares/validate-token');
require('dotenv').config()

const app = express();

//Settings
//app.set('port', process.env.PORT || 3000);

const allowedOrigins = [
    'http://localhost:3050',
    'http://172.20.10.6:3050',
    'http://10.0.0.5:3050',
    'http://10.0.0.3:3050',
    'http://172.20.10.5:3050',
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
/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });*/

app.options('*', cors())

//Routes
app.use('/', require('./routes/clients'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/devices'));
app.use('/', require('./routes/location'));
app.use('/', require('./routes/consumption'))
app.use('/', require('./routes/plug'))
app.use('/', require('./routes/bills'))

//Static files folder
app.use(express.static(__dirname + "/public"));
/*
app.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS'
})*/

//Starting server
const server = app.listen(app.get(process.env.PORT) || 4000,  () => {
    console.log(`The backend server is listening at port: ${process.env.PORT}`)
})

//Socket.io implementation
const { Server } = require('socket.io')
const io = new Server(5000, {
    cors: {
        origin: '*'
    }
});

const { Pool } = require('pg');

const pool = new Pool({
    host: `${process.env.POSTGRES_HOST}` || 'localhost',
    user: `${process.env.POSTGRES_USERNAME}` ||'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}` || 'postgres',
    port: '5432'
});

io.on('connection', (socket) => {
    console.log('A user connected')
    socket.on('data-sended', (...args) => {
        console.log('data received')
        console.log(args)
        const id_cliente = args[0].id_cliente

        setInterval(async() => {

            /*console.log('30 seconds ago: ', moment().subtract(30, 'second').format('YYYY-MM-DD H:mm:ss'))
            console.log('Now: ', moment().format('YYYY-MM-DD H:mm:ss'))*/
            const fecha_inicio = moment().subtract(30, 'second').format('YYYY-MM-DD H:mm:ss')
            const fecha_final = moment().format('YYYY-MM-DD H:mm:ss')
            const queryDevices = `SELECT
                                        localidad.alias,
                                        plug.ubicacion,
                                        dispositivo.nombre,
                                        dispositivo.marca,
                                        SUM(consumo.consumo) AS consumo
                                    FROM
                                        plug,
                                        dispositivo,
                                        consumo,
                                        localidad,
                                        cliente
                                    WHERE
                                        consumo.id_plug = plug.id_plug AND
                                        dispositivo.id_plug = plug.id_plug AND
                                        localidad.id_localidad = plug.id_localidad AND
                                        localidad.id_cliente = cliente.id_cliente AND
                                        fecha::date BETWEEN $1 AND $2 AND
                                        cliente.id_cliente = $3 
                                    GROUP BY localidad.alias, plug.ubicacion, dispositivo.nombre, dispositivo.marca`
            const queryLocations = `SELECT
                                        localidad.alias AS "alias",
                                        SUM(consumo.consumo) AS "consumo"
                                    FROM
                                        cliente,
                                        localidad,
                                        consumo,
                                        plug
                                    WHERE
                                        consumo.id_plug = plug.id_plug AND
                                        localidad.id_localidad = plug.id_localidad AND
                                        localidad.id_cliente = cliente.id_cliente AND
                                        fecha::date BETWEEN $1 AND $2 AND
                                        cliente.id_cliente = $3
                                    GROUP BY localidad.alias`
    
            const responseDevices = await pool.query(queryDevices, [ fecha_inicio, fecha_final, id_cliente ])
            const responseLocations = await pool.query(queryLocations, [ fecha_inicio, fecha_final, id_cliente ])

            socket.emit('data-response', {
                devices: responseDevices.rows,
                locations: responseLocations.rows
            })
        }, 1000)
    })
    
    
    /*setInterval(() => {
    //socket.removeAllListeners()
    //actualTime = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()
    let actualTime=''
    //console.log(actualTime)
    actualTime = new Date().toLocaleTimeString();

    socket.emit('info-msg', {
        msg: `Hi, this is a info message and the date is: ${actualTime}` 
    }
    }, 1000)*/
})