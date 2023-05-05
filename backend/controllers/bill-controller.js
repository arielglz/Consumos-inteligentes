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

    const fecha_final = moment().format('YYYY-MM-DD H:mm:ss');
    const fecha_inicio= moment().endOf('').subtract(15, 'days').format('YYYY-MM-DD H:mm:ss');

    const queryClient = `SELECT * FROM cliente`
    const clientsRes = await pool.query(queryClient)

    clientsRes.rows.forEach(async i => {
        const { id_cliente } = i
        let monto = 0;
        let total_consumo = 0;
        let localidad = ''
        const queryConsumptions = `SELECT
                                        localidad.id_localidad as "id_localidad",
                                        localidad.alias as "alias",
                                        SUM(consumo.consumo) AS "consumo",
                                        AVG(consumo.consumo) AS "habito"
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
                                    GROUP BY localidad.alias, localidad.id_localidad     
                                    `
        const clientsConsumptionRes = await pool.query(queryConsumptions, [fecha_inicio, fecha_final, id_cliente])

        let cnt = 0;
        clientsConsumptionRes.rows.forEach(async i => {
            const { id_localidad, alias, consumo, habito } = i
            monto = (consumo * 6.05) + 42.10
            
            const queryInsertFactura = `
                                INSERT INTO factura (monto, habito_de_consumo, consumo, escala_de_precio, tarifa, fecha) VALUES ($1, $2, $3, $4, $5, $6)
                                `
            const billInsertRes = await pool.query(queryInsertFactura, [parseFloat(monto).toFixed(2), parseFloat(habito).toFixed(2), consumo, 6.05, 'BTS1', moment().format('YYYY-MM-DD')])
            const queryGetLastBill = `
                                    SELECT * FROM factura ORDER BY id_factura DESC LIMIT 1
                                    `
            const getLastBillRes = await pool.query(queryGetLastBill)
            const { id_factura} = getLastBillRes.rows[0]

            const id_consumo = cnt+1
            const id_cliente_factura = id_factura + cnt
            const queryInsertFacturaLocalidad = `
                                        INSERT INTO consumo_localidad (id_localidad, id_consumo, id_cliente_factura) VALUES ($1, $2, $3) 
                                        `
            const InsertConsumoLocalidad = await pool.query(queryInsertFacturaLocalidad, [id_localidad, id_consumo, id_cliente_factura])
            cnt++

        });
    })
    res.status(200).json({msg: 'todo bien'});
}


module.exports = {
    getBills,
    getClientsConsumptionBills
}