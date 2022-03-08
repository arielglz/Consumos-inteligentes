const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: 'micro_controller',
    port: '5432'
});

const schemaDeviceRegistration = Joi.object({
    nombre: Joi.string().min(4).max(40).required(),
    marca: Joi.string().min(4).max(40).allow(''),
    serial: Joi.string().min(4).max(40).required(),
    voltaje: Joi.string().min(10).max(12).required(),
    id_plug: Joi.string().min(6).max(40).required()
})

const getDevices = async (req, res) => {
    const response = await pool.query('SELECT * FROM dispositivo ORDER BY id_dispositivo');
    res.status(200).json(response.rows);
}

const getDevicesByID = async (req, res) => {
    const response = await pool.query('SELECT * FROM dispositivo WHERE id_dispositivo = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const registerDevice = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaDeviceRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    //Validate if email already exists
    const isDeviceExist = await pool.query('SELECT * FROM dispositivos WHERE serial = $1', [req.body.serial]);
    //console.log(isEmailExist.rowCount);
    if (isEmailExist.rowCount > 0) {
        return res.status(400).json({
            error: 'El dispositivo introducido ya está siendo utilizado, favor de ingresar otro.'
        })
    }

    const { nombre, marca, serial, voltaje, id_plug } = req.body;
    const response = await pool.query('INSERT INTO dispositivo (nombre, marca, serial, voltaje, id_plug) VALUES ($1, $2, $3, $4, $5)', [ nombre, marca, serial, voltaje, id_plug ]);
    res.status(200).json({
        msg: `Dispositivo ${nombre} creado satisfactoriamente.` 
    });
}

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
    }*/

    const { nombre, marca, serial, voltaje, id_plug } = req.body;
    const response = await pool.query('UPDATE dispositivo SET (nombre, marca, serial, voltaje, id_plug) VALUES ($1, $2, $3, $4, $5) WHERE id_dispositivo = $6', 
                                     [ nombre, marca, serial, voltaje, id_plug, req.params.id ]);
    res.status(200).json({
        msg: `Dispositivo ${nombre} actualizado satisfactoriamente.` 
    });
}

const deleteDeviceByID = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM dispostivos WHERE id_dispositivo = $1', [id]);
    res.status(200).json({
        message: 'Dispositivo eliminado'
    });
}

module.exports = {
    getDevices,
    getDevicesByID,
    registerDevice,
    updateDevice,
    deleteDeviceByID
}