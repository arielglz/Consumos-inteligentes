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

const schemaLocationRegistration = Joi.object({
    direccion: Joi.string().min(4).max(200).required(),
    municipio: Joi.string().min(4).max(40).allow(''),
    ciudad: Joi.string().min(4).max(40).required(),
    provincia: Joi.string().min(4).max(12).required(),
    pais: Joi.string().min(6).max(40).required(),
    id_cliente: Joi.string().min(1).max(10).required()
})

const getLocations = async (req, res) => {
    const response = await pool.query('SELECT * FROM localidad ORDER BY id_localidad');
    res.status(200).json(response.rows);
}

const getLocationsByID = async (req, res) => {
    const response = await pool.query('SELECT * FROM localidad WHERE id_localidad = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const getMyLocationsByClientID = async (req, res) => {
    const response = await pool.query('SELECT * FROM localidad WHERE id_cliente = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

const registerLocation = async(req, res) => {
    //Validate cliente data before insert

    const { error } = schemaLocationRegistration.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

  /*  //Validate if email already exists
    const isLocationExist = await pool.query('SELECT * FROM localidad WHERE id_localidad = $1', [req.body.serial]);
    //console.log(isEmailExist.rowCount);
    if (isEmailExist.rowCount > 0) {
        return res.status(400).json({
            error: 'El dispositivo introducido ya está siendo utilizado, favor de ingresar otro.'
        })
    }*/

    const { direccion, municipio, ciudad, provincia, pais, id_cliente } = req.body;
    const response = await pool.query('INSERT INTO localidad (direccion, municipio, ciudad, provincia, pais, id_cliente) VALUES ($1, $2, $3, $4, $5, $6)', 
                                        [ direccion, municipio, ciudad, provincia, pais, id_cliente ]);
    res.status(200).json({
        msg: `Localidad del cliente ${id_cliente} creada satisfactoriamente.` 
    });
}

const updateLocation = async(req, res) => {
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

    const { direccion, municipio, ciudad, provincia, pais, id_cliente } = req.body;
    const response = await pool.query('UPDATE localidad SET (direccion, municipio, ciudad, provincia, pais, id_cliente) VALUES ($1, $2, $3, $4, $5, $6) WHERE id_localidad = $7', 
                                        [ direccion, municipio, ciudad, provincia, pais, id_cliente, req.params.id ]);
    res.status(200).json({
        msg: `Localidad ${req.params.id} actualizada satisfactoriamente.` 
    });
}

const deleteLocationByID = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM localidad WHERE id_localidad = $1', [id]);
    res.status(200).json({
        message: 'Localidad eliminado'
    });
}

module.exports = {
    getLocations,
    getLocationsByID,
    getMyLocationsByClientID,
    registerLocation,
    updateLocation,
    deleteLocationByID
}