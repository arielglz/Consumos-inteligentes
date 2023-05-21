--Listado de Factura por  primer nombre cliente
select * from factura where id_factura = (select id_factura from cliente_factura 
where id_cliente = (select id_cliente from cliente where lower(p_nombre) like '%liliberth%'));

-- consumo de una casa por cliente por dia X
select  AVG(consumo) from consumo where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%liliberth%'))) and ( fecha >= now() - interval '1 day') ;

--Listado de dispositivos por casa del cliente
select * from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%lilibeth%'));

--Listado de localidades de un cliente
select * from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%liliberth%');

--Listado de disposivos por plug de una id_localidad
select * from dispositivo   where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_localidad = '1'));

--Listado de disposivos por cliente
select * from dispositivo   where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%manuel%')));

--consumo actual por cliente por factura
select  AVG(consumo) from consumo where id_plug = (select id_plug from plug 
where id_localidad = (select id_localidad from localidad where id_cliente = 
(select id_cliente from cliente where lower(p_nombre) like '%manuel%'))) and ( fecha >= now() - interval '1 month') ;

--contrasena del usuario cliente por correo:
select  password from cliente where id_cliente= (select id_cliente from cliente where email ='manuel@gmail.com' ) ;

 