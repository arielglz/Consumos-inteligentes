CREATE DATABASE micro_controller;

CREATE TABLE CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
    p_nombre VARCHAR(40) NOT NULL,
    s_nombre VARCHAR(40),
    p_apellido VARCHAR(40) NOT NULL,
    s_apellido VARCHAR(40),
    numero VARCHAR(13) NOT NULL,
    email TEXT NOT NULL
);

INSERT INTO users (name, email) VALUES
    ('Joe', 'joe@ibm.com'),
    ('Jose', 'jose@vp.com');