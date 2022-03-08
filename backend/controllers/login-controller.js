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

//Validate input data
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

const authClient = async (req, res) => {
    const { error } = schemaLogin.validate(req.body);
    if (error) {
        return res.status(400)({
            error: error.details[0].message
        })
    }

    const isEmailExist = await pool.query('SELECT email FROM cliente WHERE email = $1', [req.body.email]);
    const { rows } = await pool.query('SELECT p_nombre, p_apellido, email, password FROM cliente WHERE email = $1', [req.body.email]);

    if (!isEmailExist.rowCount) {
        return res.status(400).json({
            error: "El email ingresado no ha sido encontrado, favor de ingresar un nuevo email."
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, rows[0].password);
    if(!validPassword) {
        return res.status(400).json({
            error: 'Contraseña invalida, favor de reeingresar la contraseña.'
        })
    }

    const token = jwt.sign({
        name: rows[0].email,
        id: rows[0].id_cliente
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).json({
        msg: `Usuario ${rows[0].p_nombre} ${rows[0].p_apellido} loggeado correctamente, bievenido`,
        token
    })

}

module.exports = {
    authClient
}