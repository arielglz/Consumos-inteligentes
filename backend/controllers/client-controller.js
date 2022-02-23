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

//Validate register data
const schemaRegistration = Joi.object({
    p_nombre: Joi.string().min(4).max(40).required(),
    s_nombre: Joi.string().min(4).max(40).allow(''),
    p_apellido: Joi.string().min(4).max(40).required(),
    s_apellido: Joi.string().min(4).max(40).allow(''),
    numero: Joi.string().min(12).max(13).required(),
    email: Joi.string().min(6).max(40).required().email(),
    password: Joi.string().min(6).max(60).required()
})

const getClients = async (req, res) => {
   const response = await pool.query('SELECT * FROM cliente ORDER BY id_cliente');
   res.status(200).json(response.rows);
}

const getClientById = async (req, res) => {
    /*const response = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.status(200).json(response.rows);*/
    console.log("Cliente creado");
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
    if (isEmailExist.rowCount > 0) {
        return res.status(400).json({
            error: 'El email introducido ya está siendo utilizado, favor de ingresar otro.'
        })
    }
    //Do a hash to the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    console.log(password);

    const { p_nombre, s_nombre, p_apellido, s_apellido, numero, email } = req.body;
    const response = await pool.query('INSERT INTO cliente ( p_nombre, s_nombre, p_apellido, s_apellido, numero, email, password ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ p_nombre, s_nombre, p_apellido, s_apellido, numero, email, password ]);
    res.status(200).json({
        msg: `Cliente ${p_nombre} ${p_apellido} creado satisfactoriamente.` 
    });
}

const updateClientById = async (req, res) => {
    /*const { name, email } = req.body;
    const id = req.params.id;
    const response = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.status(200).json({
        message: 'User updated'
    });*/
}

const deleteClientById = async (req, res) => {
    /*const id = req.params.id;
    const response = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({
        message: 'User deleted'
    });*/
}

module.exports = {
    getClients,
    getClientById,
    registerClient,
    updateClientById,
    deleteClientById
}