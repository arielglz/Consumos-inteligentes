import psycopg2, json

HOST = 'localhost'
PORT = '5432'
#USER = 'postgres'
#PASSWORD = 'postgres'
#DB = 'postgres'

USER = 'postgres'
PASSWORD = 'tengohambre1'
DB = 'micro_controller'

#Conexion

connection_address = """
host=%s port=%s user=%s password=%s dbname=%s
""" % (HOST, PORT, USER, PASSWORD, DB)

connection = psycopg2.connect(connection_address)

cursor = connection.cursor()

# Obtener todos los clientes
SQL = 'SELECT * FROM cliente'
cursor.execute(SQL)
all_clientes = cursor.fetchall()
print(json.loads(str(all_clientes)))
query = """ SELECT
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
                fecha::date BETWEEN %s AND %s AND
                cliente.id_cliente = %s 
            """ #% ('2022-03-01 00:00:00', '2022-03-31 23:59:59', cliente[0][0])
"""
for cliente in all_clientes:

    cursor.execute(query)
    monto_cliente = [][]
    consumos_cliente = cursor.fetchall()
    for consumo in consumos_cliente:
        monto_cliente
"""
cursor.close()
connection.close()
#print('All values: ', json.dumps(all_values))
#    print(simplejson.dumps(i))