select * from consumo_localidad
select * from consumo
select * from dispositivo
select * from localidad
select * from factura
select * from plug

SELECT
	localidad.alias as "Direccion",
	--consumo.consumo as "Consumo"
	--(SELECT consumo FROM consumo) as "Consumo"
	SUM(consumo.consumo) AS "Consumo"
FROM
	consumo_localidad,
	localidad,
	consumo,
	plug
WHERE
	consumo_localidad.id_localidad = localidad.id_localidad AND
	--consumo_localidad.id_consumo = consumo.id_consumo AND
	consumo.id_plug = plug.id_plug AND
	consumo_localidad.id_localidad = plug.id_localidad AND
	--consumo_localidad.id_localidad = 1
	localidad.id_cliente = 2
GROUP BY localidad.alias


-- consumo de una casa por cliente por dia X
select  AVG(consumo) from consumo where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%liliberth%'))) and ( fecha >= now() - interval '1 day');

select * from cliente;

--Listado de disposivos por cliente
select * from dispositivo   where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(nombres) like '%manuel%'))) group by id_plug;

select * from dispositivo
select * from localidad order by id_localidad asc
select * from plug
-- Solo hay 3 plug, de esos tres solo el plug_id 1 y el 3 son de la localidad 1,
-- la localidad 1 es del cliente 1
-- existen 4 dispositivos, 2 de ellos estan conectados al plug 1 y otros al plug 2

--- Dispositivos por cliente
SELECT 
	localidad.alias,
	--localidad.id_localidad,
	plug.ubicacion,
	--plug.id_localidad,
	dispositivo.nombre,
	dispositivo.marca,
	dispositivo.voltaje,
	plug.estado,
	dispositivo.id_dispositivo
FROM 
	dispositivo,
	plug,
	localidad
WHERE 
    localidad.id_localidad = plug.id_localidad AND
	plug.id_plug = dispositivo.id_plug AND
	localidad.id_cliente = 3

select * from localidad where alias is null and id_cliente = 3

UPDATE plug SET estado = 'ON' WHERE id_plug = 1;

UPDATE localidad SET id_cliente = 3 WHERE id_localidad = 1;
UPDATE localidad SET alias = 'Mi Casa' WHERE id_localidad = 1;
UPDATE localidad SET alias = 'Mi Novia Casa' WHERE id_localidad = 2;
UPDATE localidad SET alias = 'Casa Abuela' WHERE id_localidad = 3;
UPDATE localidad SET alias = 'Casa Tio Fran' WHERE id_localidad = 4;
UPDATE localidad SET alias = 'Mi Oficina' WHERE id_localidad = 5;
	--- dispositivo.id_plug = plug.id_plug AND 
	--- localidad.id_localidad = plug.id_localidad AND 
	--- localidad.id_cliente = cliente.id_cliente AND
	--- cliente.id_cliente = 3
	
-- Obtener todos los plugs de un cliente
SELECT
	plug.id_plug,
	localidad.alias,
	plug.ubicacion,
	plug.cant_puerto,
	plug.estado
FROM
	plug,
	localidad,
	cliente
WHERE
	localidad.id_localidad = plug.id_localidad AND
	localidad.id_cliente = cliente.id_cliente AND
	cliente.id_cliente = 3
	
