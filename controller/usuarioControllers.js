const fsPromises = require("fs").promises;
const path = require('path');
const fs = require("fs");
const connection = require('../db');
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const bcrypt = require('bcrypt');

//usuarios

function renderUsuario (req,res){
    res.render("register", {errors: []});
  };
  
  const registrarUsuario = (req, res) => {
    const { nombre, nombre_usuario, email, password, date, telefono, pais, genero } = req.body;

    const saltRounds = 10; // Define el número de saltos (rounds) para el algoritmo de hash

    // Genera un salt y luego encripta la contraseña
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error('Error al generar el salt:', err);
            res.status(500).json({ error: 'Error al registrar el nuevo usuario' });
        } else {
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    console.error('Error al encriptar la contraseña:', err);
                    res.status(500).json({ error: 'Error al registrar el nuevo usuario' });
                } else {
                    const insertQuery = 'INSERT INTO usuario (nombre, nombre_usuario, email, password, fecha_registro, telefono, genero, pais, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)';

                    connection.query(
                        insertQuery,
                        [nombre, nombre_usuario, email, hashedPassword, date, telefono, genero, pais], // Usar la contraseña encriptada
                        (error, results) => {
                            if (error) {
                                console.error('Error al agregar el nuevo usuario en la base de datos:', error);
                                res.status(500).json({ error: 'Error al registrar el nuevo usuario' });
                            } else {
                                res.send('Nuevo usuario agregado con éxito');
                            }
                        }
                    );
                }
            });
        }
    });
};

  //encontrar por id 
  async function obtenerUsuarioPorId(req, res) {
    try {
      const idBuscado = parseInt(req.params.id); // Convertimos el parámetro ID a un número entero
      const dataFilePath = path.join(__dirname, "../usuarios.json");
  
      const data = await fsPromises.readFile(dataFilePath, 'utf-8');
      const usuarios = JSON.parse(data);
  
      const usuarioEncontrado = usuarios.find((usuario) => usuario.id === idBuscado);
  
      if (!usuarioEncontrado) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      } else {
        res.status(200).json(usuarioEncontrado);
      }
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      res.status(500).json({ error: 'Error al obtener el usuario por ID.' });
    }
  }

//actualizar

async function actualizarUsuario(req, res) {
  try {
    const dataFilePath = path.join(__dirname, "../usuarios.json");
    const userIdToUpdate = parseInt(req.params.id);

    // Leer los usuarios actuales del archivo JSON
    const data = await readFileAsync(dataFilePath, "utf-8");
    const usuarios = JSON.parse(data);

    // Encontrar el índice del usuario a actualizar en base a su ID
    const usuarioIndex = usuarios.findIndex((usuario) => usuario.id === userIdToUpdate);

    if (usuarioIndex !== -1) {
      // Actualizar los datos del usuario en la matriz
      usuarios[usuarioIndex] = { id: userIdToUpdate, ...req.body };

      // Escribir la matriz actualizada de usuarios en el archivo JSON
      await writeFileAsync(dataFilePath, JSON.stringify(usuarios, null, 2), "utf-8");

      // Actualizar el usuario en la base de datos MySQL
      const updateQuery =
      "UPDATE usuario SET nombre = ?, email = ?, nombre_usuario = ?, password = ?, date = ?, telefono = ?, genero = ? WHERE id = ?";
    connection.query(
      updateQuery,
      [
        req.body.nombre,
        req.body.email,
        req.body.nombre_usuario,
        req.body.password,
        req.body.date,
        req.body.telefono,
        req.body.genero,
        userIdToUpdate
      ],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar el usuario en la base de datos:", error);
          res.status(500).json({ error: "Error al actualizar el usuario en la base de datos." });
        } else {
          res.status(200).json({ message: "Usuario actualizado exitosamente." });
        }
      }
    );
    
    } else {
      res.status(404).json({ error: "Usuario no encontrado en el archivo JSON." });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
}

  // Eliminar
  async function eliminarUsuario(req, res) {
    try {
      const userIdToDelete = parseInt(req.params.id);
  
      // Eliminar el usuario de la base de datos MySQL
      const deleteQuery = "DELETE FROM usuario WHERE id = ?";
  
      connection.query(deleteQuery, [userIdToDelete], (error, results) => {
        if (error) {
          console.error("Error al eliminar el usuario de la base de datos:", error);
          res.status(500).json({ error: "Error al eliminar el usuario de la base de datos." });
        } else {
          // Eliminar el usuario del archivo JSON solo si se eliminó correctamente de la base de datos
          const dataFilePath = path.join(__dirname, "../usuarios.json");
          const usuarios = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  
          const usuarioIndex = usuarios.findIndex((usuario) => usuario.id === userIdToDelete);
  
          if (usuarioIndex !== -1) {
            usuarios.splice(usuarioIndex, 1);
            fs.writeFileSync(dataFilePath, JSON.stringify(usuarios, null, 2));
          }
  
          res.status(200).json({ message: "Usuario eliminado exitosamente." });
        }
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ error: "Error al eliminar el usuario." });
    }
  }

module.exports = {
  renderUsuario,
  registrarUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};