CREATE TABLE  cliente (
id_cliente serial PRIMARY KEY,
nombres VARCHAR (255),
apellidos VARCHAR (355),
numero VARCHAR (355),
email VARCHAR (600),
password VARCHAR (400)
);


INSERT INTO  cliente (nombres,apellidos,numero,email,password)
VALUES('Liliberth','Cabrera','809-573-5025','lilibeth@gmail.com','123456');
INSERT INTO  cliente (nombres,apellidos,numero,email,password)
VALUES('Manuel','Ramirez','809-573-2550','manuel@gmail.com','123456789');



CREATE TABLE  factura (
id_factura serial PRIMARY KEY NOT NULL,
monto DECIMAL,
habito_de_consumo INTEGER,
consumo INTEGER,
escala_de_precio DECIMAL,
tarifa VARCHAR(50),
fecha DATE    
);

INSERT INTO  factura (monto,habito_de_consumo,consumo,escala_de_precio,tarifa,fecha)
VALUES('800.3','8','10','4.44','BTS1','2021-11-11');
INSERT INTO  factura (monto,habito_de_consumo,consumo,escala_de_precio,tarifa,fecha)
VALUES('8123','32','10','4.44','BTS1','2020-10-10');



CREATE TABLE  cliente_factura (
id_cliente_factura serial PRIMARY KEY NOT NULL,
id_cliente serial,
id_factura serial,
CONSTRAINT fk_cliente  
FOREIGN KEY(id_cliente)   
REFERENCES  cliente(id_cliente),
CONSTRAINT fk_factura  
FOREIGN KEY(id_factura)   
REFERENCES  factura(id_factura)    
);

INSERT INTO  cliente_factura (id_cliente,id_factura)
VALUES('1','2');
INSERT INTO  cliente_factura (id_cliente,id_factura)
VALUES('2','1');



CREATE TABLE  localidad (
id_localidad serial PRIMARY KEY NOT NULL,
direccion VARCHAR (600) NOT NULL,
municipio VARCHAR (255),
ciudad VARCHAR (255),
provincia VARCHAR (255),
pais VARCHAR (255),
id_cliente serial,
CONSTRAINT fk_cliente  
FOREIGN KEY(id_cliente)   
REFERENCES cliente(id_cliente)    
);

INSERT INTO  localidad (direccion,municipio,ciudad,provincia,pais,id_cliente)
VALUES('Calle 1, Residencial Santa Maria','La Vega','Concepcion de La Vega','La Vega','Republica Dominicana','1');
INSERT INTO  localidad (direccion,municipio,ciudad,provincia,pais,id_cliente)
VALUES('Calle 10, Residencial Don Zoilo','Distrito Nacional','Santo Domingo','Santo Domingo','Republica Dominicana','2');


CREATE TABLE  contador (
id_contador serial PRIMARY KEY NOT NULL,
circuito_de_distribucion VARCHAR (200) NOT NULL,
marca_de_medidor VARCHAR (200) NOT NULL,
nic INTEGER NOT NULL,
numero_del_medidor INTEGER NOT NULL,
centro_de_transformacion INTEGER NOT NULL,
constante_de_mult_medidor INTEGER NOT NULL,
lectura DECIMAL,
id_cliente serial,
id_localidad serial,
CONSTRAINT fk_cliente  
FOREIGN KEY(id_cliente)   
REFERENCES  cliente(id_cliente),
CONSTRAINT fk_localidad  
FOREIGN KEY(id_localidad)   
REFERENCES  localidad(id_localidad)    
);

INSERT INTO  contador (circuito_de_distribucion,marca_de_medidor,nic,numero_del_medidor,centro_de_transformacion,constante_de_mult_medidor,lectura,id_cliente,id_localidad)
VALUES('AHON103','T8-Centron S8 Twacs(Itron)','6425655','91072613','068109','1','116','1','1');
INSERT INTO  contador (circuito_de_distribucion,marca_de_medidor,nic,numero_del_medidor,centro_de_transformacion,constante_de_mult_medidor,lectura,id_cliente,id_localidad)
VALUES('AHON002','T8-Centron S8 Twacs(Itron)','5232561','21048612','045236','1','200','2','2');





CREATE TABLE  plug (
id_plug serial PRIMARY KEY NOT NULL,
ubicacion VARCHAR (300) NOT NULL,
cant_puerto INTEGER,
estado VARCHAR (100),
id_localidad serial,
CONSTRAINT fk_localidad  
FOREIGN KEY(id_localidad)   
REFERENCES  localidad(id_localidad)     
);
INSERT INTO  plug (ubicacion,cant_puerto,id_localidad)
VALUES('Sala','1','1');
INSERT INTO  plug (ubicacion,cant_puerto,id_localidad)
VALUES('Cocina','1','2');


CREATE TABLE  dispositivo (
id_dispositivo serial PRIMARY KEY NOT NULL,
nombre VARCHAR (300) NOT NULL,
serial VARCHAR (200),
marca VARCHAR (200),
voltaje INTEGER,
id_plug serial,
CONSTRAINT fk_plug  
FOREIGN KEY(id_plug)   
REFERENCES  plug(id_plug)     
);
INSERT INTO  dispositivo (nombre,serial,voltaje,id_plug)
VALUES('Nevera','SN-122425','110','1');
INSERT INTO  dispositivo (nombre,serial,voltaje,id_plug)
VALUES('Estufa','SN-140203','110','2');



CREATE TABLE  consumo (
id_consumo serial PRIMARY KEY NOT NULL,
consumo DECIMAL NOT NULL,
fecha timestamp NOT NULL,
id_plug serial,
CONSTRAINT fk_plug  
FOREIGN KEY(id_plug)   
REFERENCES  plug(id_plug)     
);

INSERT INTO  consumo (consumo,fecha, id_plug)
VALUES('0.0120','00:00:00','2022-03-31','2022-03-31 01:10:25 ',1);
INSERT INTO  consumo (consumo, fecha, id_plug)
VALUES('0.4000','00:00:00','2022-03-31','2022-03-31 01:13:25 ',1);
INSERT INTO  consumo (consumo,fecha, id_plug)
VALUES('1.2340','00:00:00','2022-03-31','2022-03-31 01:14:25 ',1);

INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0010','11:00:00','2021-11-17','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0011','11:00:00','2021-10-20','2');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0012','11:02:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0013','11:03:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0014','11:04:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0015','11:05:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0016','11:06:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0017','11:07:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0018','11:08:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0016','11:09:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0016','11:10:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0016','11:11:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0017','11:11:01','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0019','11:12:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0011','11:12:02','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0013','11:12:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0016','11:13:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0017','11:13:09','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0017','11:14:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0017','11:14:04','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0011','11:16:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0026','11:26:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0036','11:36:00','2021-10-20','1');
INSERT INTO  consumo (consumo,hora,fecha,id_plug)
VALUES('0.0056','11:46:00','2021-10-20','1');



CREATE TABLE  consumo_localidad (
id_consumo_localidad serial PRIMARY KEY NOT NULL,
id_localidad serial,
id_consumo serial,
id_cliente_factura serial,
CONSTRAINT fk_consumo  
FOREIGN KEY(id_consumo)   
REFERENCES  consumo(id_consumo),
CONSTRAINT fk_localidad  
FOREIGN KEY(id_localidad)   
REFERENCES  localidad(id_localidad),
CONSTRAINT fk_cliente_factura  
FOREIGN KEY(id_cliente_factura)   
REFERENCES  cliente_factura(id_cliente_factura)     
);

INSERT INTO  consumo_localidad (id_localidad,id_consumo,id_cliente_factura)
VALUES('1','1','1');
INSERT INTO  consumo_localidad (id_localidad,id_consumo,id_cliente_factura)
VALUES('2','2','2');


commit;
