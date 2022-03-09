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
        msg: `Plug en la ubicación ${ubicacion} creado satisfactoriamente.` 
    });
}
/*
const updateDevice = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaDeviceRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }/*

    //Validate if email already exists
    const isDeviceExist = await pool.query('SELECT * FROM dispositivos WHERE serial = $1', [req.body.serial]);
    //console.log(isEmailExist.rowCount);
    if (isEmailExist.rowCount > 0) {
        return res.status(400).json({
            error: 'El dispositivo introducido ya está siendo utilizado, favor de ingresar otro.'
        })
    }

    const { nombre, marca, serial, voltaje, id_plug } = req.body;
    const response = await pool.query('UPDATE dispositivo SET (nombre, marca, serial, voltaje, id_plug) VALUES ($1, $2, $3, $4, $5) WHERE id_dispositivo = $6', 
                                     [ nombre, marca, serial, voltaje, id_plug, req.params.id ]);
    res.status(200).json({
        msg: `Dispositivo ${nombre} actualizado satisfactoriamente.` 
    });
}*/

const deletePlugByID = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM plug WHERE id_plug = $1', [id]);
    res.status(200).json({
        message: 'Plug eliminado'
    });
}

module.exports = {
    getPlugs,
    getPlugsByLocationID,
    registerPlug,
    deletePlugByID
}