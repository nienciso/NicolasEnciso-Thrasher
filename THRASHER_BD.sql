Create database THRASHER;
USE THRASHER;

CREATE TABLE productos (
id INT AUTO_INCREMENT,
nombre VARCHAR(50),
precio DECIMAL(12,2),
PRIMARY KEY (id)
);

CREATE TABLE categoria (
	id INT AUTO_INCREMENT,
    nombre VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE usuario(
	id INT AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    email VARCHAR(255),
    PRIMARY KEY(id)
);

ALTER TABLE productos
ADD COLUMN categoria_id INT,
ADD FOREIGN KEY (categoria_id) REFERENCES categoria(id);


INSERT INTO categoria (id, nombre) VALUES
( 3, "Trucks");

SELECT 
	productos.id,
    productos.nombre AS nombre_prod,
    precio,
    categoria.id AS id_cat,
    categoria.nombre AS nombre_cat
FROM
    productos
        JOIN
    categoria ON productos.categoria_id = categoria.id;
    
    select * from productos; 
    