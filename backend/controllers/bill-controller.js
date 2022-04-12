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

const getClientsConsumptionBills = async (req, res) => {
    /*const { fecha_inicio, fecha_final } = req.body
    const queryClient = `SELECT * FROM cliente`
    const clientsRes = await pool.query(queryClient)

    let clientesData = []

    clientsRes.rows.forEach(i => {
        const { id_cliente } = i
        let monto = 0;
        let total_consumo = 0;
        let localidad = ''
        let cnt = 0
        const queryConsumptions = `
                                SELECT
                                    localidad.alias AS "alias",
                                    (consumo.consumo) AS "consumo"
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
                                `
        const clientsConsumptionRes = await pool.query(queryConsumptions, [fecha_inicio, fecha_final, id_cliente])
        clientsConsumptionRes.rows.forEach(i => {
            const { alias, consumo } = i

            switch (consumo) {
                case (consumo >= 201 && consumo <= 300):
                    monto += consumo * 8.59
                    break;
                case (consumo >= 301 && consumo <= 700):
                    monto += consumo * 12.89
                    break;
                case (consumo > 700):
                    monto += consumo * 13.09
                    break;       
                default:
                    monto += consumo * 6.05;
            }

            total_consumo += consumo
            localidad = alias
            cnt++
        })

        clientesData.push({
            fecha: moment().format('YYYY-MM-DD'),
            alias: localidad,
            habito: `${total_consumo/cnt} kWh`,
            consumo: `${total_consumo} kWh`,
            costo: `${parseFloat(monto).toFixed(2)} RD$`
        })
    });

    res.status(200).json(clientesData);*/
}


module.exports = {
    getBills,
    getClientsConsumptionBills
}