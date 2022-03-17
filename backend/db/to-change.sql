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

COMMIT;