const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    host: `${process.env.POSTGRES_HOST}` || 'localhost',
    user: `${process.env.POSTGRES_USERNAME}` ||'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}` || 'postgres',
    port: '5432'
});

const getAllConsumptions = async (req, res) => {
    const response = await pool.query('SELECT * FROM consumo');
    res.status(200).json(response.rows);
}


const getConsumptionByLocationID = async (req, res) => {
    const locationID = req.params.id;
    const response = await pool.query('SELECT * FROM consumo_localidad WHERE id_localidad = $1', [ locationID ]);
    res.status(200).json(response.rows);
}

const getConsumptionsByPlugID = async (req, res) => {
    const plugID = req.params.id;
    const response = await pool.query('SELECT * FROM consumo WHERE id_plug = $1', [req.params.id]);
    res.status(200).json(response.rows);
}

module.exports = {
    getConsumptionByLocationID,
    getConsumptionsByPlugID,
    getAllConsumptions
}