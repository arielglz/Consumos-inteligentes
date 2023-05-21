const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({
    host: `${process.env.POSTGRES_HOST}` || 'localhost',
    user: `${process.env.POSTGRES_USERNAME}` ||'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}` || 'dblab',
    port: '5432'
});

//Validate register data
const schemaRegistration = Joi.object({
    // nombres: Joi.string().min(4).max(40).required(),
    // apellidos: Joi.string().min(4).max(40).required(),
    p_nombre: Joi.string().min(4).max(40).required(),
    s_nombre: Joi.string().min(4).max(40),
    p_apellido: Joi.string().min(4).max(40).required(),
    s_apellido: Joi.string().min(4).max(40),
    numero: Joi.string().min(10).max(12).required(),
    email: Joi.string().min(6).max(40).required().email(),
    password: Joi.string().min(6).max(60).required()
})

const getClients = async (req, res) => {
   const response = await pool.query('SELECT * FROM cliente ORDER BY id_cliente');
   res.status(200).json(response.rows);
}


const getClientById = async (req, res) => {
    const response = await pool.query('SELECT * FROM cliente WHERE id_cliente = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const getClientByEmail = async (req, res) => {
    const response = await pool.query('SELECT * FROM cliente WHERE email = $1', [req.params.email]);
    res.status(200).json(response.rows);
}

const registerClient = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    //Validate if email already exists
    const isEmailExist = await pool.query('SELECT * FROM cliente WHERE email = $1', [req.body.email]);
    //console.log(isEmailExist.rowCount);
    if (isEmailExist.rowCount === 0) {
        return res.status(409).json({
            error: 'El email introducido no existe, favor de ingresar otro.'
        })
    }
    //Do a hash to the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    console.log(password);

    const { nombres, apellidos, numero, email } = req.body;
    const response = await pool.query('INSERT INTO cliente ( nombres, apellidos, numero, email, password ) VALUES ($1, $2, $3, $4, $5)', [ nombres, apellidos, numero, email, password ]);
    res.status(200).json({
        msg: `Cliente ${nombres} ${apellidos} creado satisfactoriamente.` 
    });
}

const updateClientById = async (req, res) => {
    const { nombres, apellidos, numero, email, password } = req.body;
    //console.log(Object.keys(req.body).length)

    if (password) {
        console.log('con password')
        const query = `UPDATE cliente
                        SET
                            nombres = $1,
                            apellidos = $2,
                            numero = $3,
                            email = $4,
                            password = $5
                        WHERE
                            id_cliente = $6
                        `
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);
        const response = await pool.query(query, [nombres, apellidos, numero, email, hashedPwd, req.params.id]);
    } else {
        const query = `UPDATE cliente
                        SET
                            nombres = $1,
                            apellidos = $2,
                            numero = $3,
                            email = $4
                        WHERE
                            id_cliente = $5
        `
        const response = await pool.query(query, [nombres, apellidos, numero, email, req.params.id]);
    }

    res.status(200).json({
        message: 'Cliente actualizado correctamente'
    });
}

const updatePasswordByEmail = async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const isEmailExist = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
    //console.log(isEmailExist.rowCount);
    if (isEmailExist.rowCount === 0) {
        return res.status(409).json({
            error: 'El email introducido no existe, favor de ingresar otro.'
        })
    }

    const query = `UPDATE cliente SET password = $1 WHERE email = $2`

    const response = await pool.query(query, [hashedPwd, email]);
    res.status(200).json({
        message: 'Contraseña actualizada satisfactoriamente'
    })
}

const deleteClientById = async (req, res) => {
    /*const id = req.params.id;
    const response = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({
        message: 'User deleted'
    });*/
}

const getClientInfoByClientID = async (req, res) => {
   const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD H:mm:ss')
   const today = moment().format('YYYY-MM-DD H:mm:ss')

    const clientID = req.params.id;
    const locationsInfo = await pool.query('SELECT COUNT(*) AS localidades FROM localidad WHERE id_cliente = $1', [clientID])
    const plugsInfo = await pool.query('SELECT COUNT(*) AS plugs FROM plug, localidad, cliente WHERE localidad.id_localidad = plug.id_localidad AND localidad.id_cliente = cliente.id_cliente AND cliente.id_cliente = $1', [clientID])
    const devicesInfo = await pool.query('SELECT COUNT(*) AS dispositivos FROM dispositivo, plug, localidad WHERE localidad.id_localidad = plug.id_localidad AND plug.id_plug = dispositivo.id_plug AND localidad.id_cliente = $1', [clientID])
    const consumptionInfo = await pool.query('SELECT MAX(consumo.consumo) AS consumo FROM plug, dispositivo, consumo, localidad, cliente WHERE consumo.id_plug = plug.id_plug AND dispositivo.id_plug = plug.id_plug AND localidad.id_localidad = plug.id_localidad AND localidad.id_cliente = cliente.id_cliente AND fecha::date BETWEEN $1 AND $2 AND cliente.id_cliente = $3 GROUP BY localidad.alias, plug.ubicacion, dispositivo.nombre, dispositivo.marca', [yesterday, today, clientID])

    res.status(200).json({
        locations: locationsInfo.rows[0].localidades,
        plugs: plugsInfo.rows[0].plugs,
        dispositivos: devicesInfo.rows[0].dispositivos,
        maxConsumption: consumptionInfo.rowCount ? `${consumptionInfo.rows[consumptionInfo.rowCount - 1].consumo} kWh` : `0 kWh`
    })
}

module.exports = {
    getClientInfoByClientID,
    getClients,
    getClientById,
    getClientByEmail,
    registerClient,
    updateClientById,
    updatePasswordByEmail,
    deleteClientById
}