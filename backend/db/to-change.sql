-- Cambiar nombres de columnas de "nombre" y "apellido" de la tabla cliente
ALTER TABLE cliente 
RENAME COLUMN p_nombre TO nombres;

ALTER TABLE cliente 
DROP COLUMN s_nombre;

ALTER TABLE cliente 
RENAME COLUMN p_apellido TO apellidos;

ALTER TABLE cliente 
DROP COLUMN s_apellido;

-- Añadir columna Alias a la tabla localidad
ALTER TABLE localidad
ADD COLUMN alias VARCHAR (100)

-- 31/03/2022 cambiando columna cdate para timestamp de los consumos

ALTER TABLE consumo
DROP COLUMN hora

ALTER TABLE consumo
DROP COLUMN fecha

ALTER TABLE consumo
ADD COLUMN fecha timestamp

INSERT INTO  consumo (consumo,fecha, id_plug)
VALUES('0.0120','00:00:00','2022-03-31','2022-03-31 01:10:25 ',1);
INSERT INTO  consumo (consumo, fecha, id_plug)
VALUES('0.4000','00:00:00','2022-03-31','2022-03-31 01:13:25 ',1);
INSERT INTO  consumo (consumo,fecha, id_plug)
VALUES('1.2340','00:00:00','2022-03-31','2022-03-31 01:14:25 ',1);

COMMIT;