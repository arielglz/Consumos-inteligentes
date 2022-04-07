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

const getAllDeviceConsumptionByClientID = async (req, res) => {
    const clientID = req.params.id;
    const response = await pool.query('SELECT localidad.alias, plug.ubicacion, dispositivo.nombre, dispositivo.marca, consumo.consumo FROM plug, dispositivo, consumo, localidad, cliente WHERE consumo.id_plug = plug.id_plug AND dispositivo.id_plug = plug.id_plug AND localidad.id_localidad = plug.id_localidad AND localidad.id_cliente = cliente.id_cliente AND cliente.id_cliente = $1', [clientID])
    res.status(200).json(response.rows);
}

const getClientDevicesConsumptionsBetweenDates = async (req, res) => {
    const { id_cliente, fecha_inicio, fecha_final } = req.body;
    const query = `SELECT
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
    const response = await pool.query(query, [ fecha_inicio, fecha_final, id_cliente ])

    let newArray = [];
    response.rows.forEach(i => {
        const { alias, ubicacion, nombre, marca, consumo } = i
        let costo = 0
        switch (consumo) {
            case (consumo >= 201 && consumo <= 300):
                costo = consumo * 8.59
                break;
            case (consumo >= 301 && consumo <= 700):
                costo = consumo * 12.89
                break;
            case (consumo > 700):
                costo = consumo * 13.09
                break;       
            default:
                costo =  consumo * 6.05;
        }

        newArray.push({
            alias: alias,
            ubicacion: ubicacion,
            nombre: nombre,
            marca: marca,
            consumo_t: `${consumo} kWh`,
            consumo: consumo,
            costo_t: `${parseFloat(costo).toFixed(2)} RD$`,
            costo: parseFloat(costo).toFixed(2)
        })
    });

    res.status(200).json(newArray);

}

const getClientLocationConsumptionsBetweenDates = async (req, res) => {
    const { id_cliente, fecha_inicio, fecha_final } = req.body;
    const query = `SELECT
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
    const response = await pool.query(query, [ fecha_inicio, fecha_final, id_cliente ])

    let newArray = [];
    response.rows.forEach(i => {
        const { alias, consumo } = i
        let costo = 0
        switch (consumo) {
            case (consumo >= 201 && consumo <= 300):
                costo = consumo * 8.59
                break;
            case (consumo >= 301 && consumo <= 700):
                costo = consumo * 12.89
                break;
            case (consumo > 700):
                costo = consumo * 13.09
                break;       
            default:
                costo =  consumo * 6.05;
        }
        
        newArray.push({
            alias: alias,
            consumo_t: `${consumo} kWh`,
            consumo: consumo,
            costo_t: `${parseFloat(costo).toFixed(2)} RD$`,
            costo: parseFloat(costo).toFixed(2)
        })
    });

    res.status(200).json(newArray);
}

module.exports = {
    getClientLocationConsumptionsBetweenDates,
    getClientDevicesConsumptionsBetweenDates,
    getAllDeviceConsumptionByClientID,
    getConsumptionByLocationID,
    getConsumptionsByPlugID,
    getAllConsumptions
}