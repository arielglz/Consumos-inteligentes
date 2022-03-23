const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    host: `${process.env.POSTGRES_HOST}` || 'localhost',
    user: `${process.env.POSTGRES_USERNAME}` ||'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}` || 'dblab',
    port: '5432'
});

const schemaPlugRegistration = Joi.object({
    ubicacion: Joi.string().min(4).max(40).required(),
    cant_puerto: Joi.number().required(),
    estado: Joi.string().min(2).max(40).allow(''),
    id_localidad: Joi.number().required()
})

const getPlugs = async (req, res) => {
    const response = await pool.query('SELECT * FROM plug ORDER BY id_plug');
    res.status(200).json(response.rows);
}

const getPlugByID = async (req, res) => {
    const response = await pool.query('SELECT * FROM plug WHERE id_plug = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const getPlugByClientID = async (req, res) => {
    const response = await pool.query('SELECT plug.id_plug, localidad.alias, plug.ubicacion, plug.cant_puerto, plug.estado FROM plug, localidad, cliente WHERE localidad.id_localidad = plug.id_localidad AND localidad.id_cliente = cliente.id_cliente AND cliente.id_cliente = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const getPlugsByLocationID = async (req, res) => {
    const response = await pool.query('SELECT * FROM plug WHERE id_localidad = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const registerPlug = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaPlugRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    //Validate if email already exists
    /*const isPlugExist = await pool.query('SELECT * FROM plug WHERE serial = $1', [req.body.serial]);
    //console.log(isEmailExist.rowCount);
    if (isDeviceExist.rowCount > 0) {
        return res.status(400).json({
            error: 'El dispositivo introducido ya está siendo utilizado, favor de ingresar otro.'
        })
    }*/

    const { ubicacion, cant_puerto, estado, id_localidad } = req.body;
    const response = await pool.query('INSERT INTO plug (ubicacion, cant_puerto, estado, id_localidad) VALUES ($1, $2, $3, $4)', 
                        [ubicacion, cant_puerto, estado, id_localidad ]);
    res.status(200).json({
        msg: `Plug en ${ubicacion} creado satisfactoriamente.` 
    });
}

const updatePlug = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaPlugRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const { ubicacion, cant_puerto, estado, id_localidad } = req.body;
    const response = await pool.query('UPDATE plug SET ubicacion = $1, cant_puerto = $2, estado = $3, id_localidad = $4 WHERE id_plug = $5', 
                                     [ ubicacion, cant_puerto, estado, id_localidad, req.params.id ]);
    res.status(200).json({
        msg: `Plug en ${ubicacion} actualizado satisfactoriamente.` 
    });
}

const deletePlugByID = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM plug WHERE id_plug = $1', [id]);
    res.status(200).json({
        message: 'Plug eliminado correctamente'
    });
}

module.exports = {
    getPlugs,
    getPlugByID,
    getPlugByClientID,
    getPlugsByLocationID,
    registerPlug,
    deletePlugByID,
    updatePlug
}