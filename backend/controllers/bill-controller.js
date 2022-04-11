const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({
    host: `${process.env.POSTGRES_HOST}` || 'localhost',
    user: `${process.env.POSTGRES_USERNAME}` ||'postgres',
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}` || 'postgres',
    port: '5432'
});

const getBills = async (req, res) => {
    //const { id_cliente, fecha_inicio, fecha_final } = req.body;
    const id_cliente = req.params.id
    const query = `SELECT
                        factura.fecha,
                        localidad.alias,
                        factura.habito_de_consumo,
                        factura.consumo,
                        factura.monto
                    FROM
                        cliente,
                        factura,
                        localidad,
                        consumo_localidad
                    WHERE
                        consumo_localidad.id_cliente_factura = factura.id_factura AND
                        consumo_localidad.id_localidad = localidad.id_localidad AND
                        localidad.id_cliente = cliente.id_cliente AND
                        cliente.id_cliente = $1 
                    `
    const response = await pool.query(query, [ id_cliente ])
    

    let newArray = [];
    response.rows.forEach(i => {
        const { fecha, alias, habito_de_consumo, consumo, monto } = i

        newArray.push({
            fecha: moment(fecha).format('YYYY-MM-DD'),
            alias: alias,
            habito: `${habito_de_consumo} kWh`,
            consumo: `${consumo} kWh`,
            costo: `${parseFloat(monto).toFixed(2)} RD$`
        })
    });

    res.status(200).json(newArray);

}


module.exports = {
    getBills
}