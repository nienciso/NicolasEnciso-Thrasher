use thrasher;

select * from  usuario;
DROP TABLE usuario;

CREATE TABLE usuarios(
	id INT NOT NULL AUTO_INCREMENT,
	tipoUsuario varchar(255),
  PRIMARY KEY (id)
);