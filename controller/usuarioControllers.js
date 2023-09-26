const fsPromises = require("fs").promises;
const path = require('path');
const fs = require("fs");


function renderUsuario (req,res){
    res.render("register", {errors: []});
  };
  

 const registrarUsuario = (req, res) => {
  const { id,name,name_usuario,email, password,password_repeat,date,telefono,pais,genero} = req.body;

  const registrarNuevo = {
    id,
    name,
    name_usuario,
    email,
    password,
    password_repeat,
    date,
    telefono,
    pais,
    genero
  };
  const dataFilePath = path.join(__dirname, "../usuarios.json");
  try {
    let usuarios = []; // Inicializamos usuarios como un array vacío

    if (fs.existsSync(dataFilePath)) {
      usuarios = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    }

    usuarios.push(registrarNuevo);

    fs.writeFileSync(dataFilePath, JSON.stringify(usuarios, null, 2), "utf-8");

    res.send("Nuevo usuario agregado con éxito");
  } catch (error) {
    console.error("Error al agregar el nuevo usuario:", error);
    res.status(500).json({ error: "Error al agregar el nuevo usuario." });
  }
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
    const dataBuffer = await fsPromises.readFile(dataFilePath);
    const data = dataBuffer.toString('utf8');
    const usuarios = JSON.parse(data);

    // Encontrar el índice del usuario a actualizar en base a su ID
    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === userIdToUpdate);

    if (usuarioIndex !== -1) {
      // Actualizar los datos del usuario en la matriz
      usuarios[usuarioIndex] = { id: userIdToUpdate, ...req.body };

      // Escribir la matriz actualizada de usuarios en el archivo JSON
      await fsPromises.writeFile(dataFilePath, JSON.stringify(usuarios, null, 2));

      res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
}


  // Eliminar
  
  function eliminarUsuario(req, res) {
    try {
      const dataFilePath = path.join(__dirname, "../usuarios.json");
      const userIdToDelete = parseInt(req.params.id); // Suponemos que el ID del usuario a eliminar se pasa como parámetro en la URL
  
      // Leer los usuarios actuales del archivo JSON
      const usuarios = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
      // Encontrar el índice del usuario a eliminar en base a su ID
      const usuarioIndex = usuarios.findIndex(usuario => usuario.id === userIdToDelete);
  
      if (usuarioIndex !== -1) {
        // Eliminar el usuario de la matriz de usuarios por su índice
        usuarios.splice(usuarioIndex, 1);
  
        // Escribir la matriz actualizada de usuarios de nuevo en el archivo JSON
        fs.writeFileSync(dataFilePath, JSON.stringify(usuarios, null, 2));
  
        res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el usuario.' });
    }
  }
  

module.exports = {
  renderUsuario,
  registrarUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};