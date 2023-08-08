const fs = require("fs");
const path = require('path');


function renderProducto (req,res){
    res.render("productos", {errors: []});
  };
  
 //no me registra mas de un objeto en json 

 const registrarProducto = (req, res) => {
  const { id, name, descripcion, precio } = req.body;
  const registrarNuevo = {
    id,
    name,
    descripcion,
    precio,
  };

  const dataFilePath = path.join(__dirname, "../productos.json");

  try {
    const productos = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

    productos.push(registrarNuevo);

    fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2), "utf-8");

    res.send("Nuevo producto agregado con éxito");
  } catch (error) {
    console.error("Error al agregar el nuevo producto:", error);
    res.status(500).json({ error: "Error al agregar el nuevo producto." });
  }
};

  //encontrar por id 
  function obtenerProductoPorId(req, res) {
    try {
      const idBuscado = parseInt(req.params.id); // Convertimos el parámetro ID a un número entero
      const dataFilePath = path.join(__dirname, "../productos.json");

      const productos = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));


      
      const productoEncontrado = productos.find((producto) => producto.id === idBuscado);
  
      if (!productoEncontrado) {
        res.status(404).json({ error: 'Producto no encontrado.' });
      } else {
        res.status(200).json(productoEncontrado);
      }
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      res.status(500).json({ error: 'Error al obtener el producto por ID.' });
    }
  }
//actualizar


  function actualizarProducto(req, res) {
    try {
      const data = JSON.stringify(req.body, null, 2); // Formateamos el JSON
      fs.writeFileSync(dataFilePath, data);
      res.status(200).json({ message: 'JSON actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar el JSON:', error);
      res.status(500).json({ error: 'Error al actualizar el JSON.' });
    }
  };

  // Eliminar
  
  function eliminarProducto(req, res) {
    try {
      fs.unlinkSync(dataFilePath);
      res.status(200).json({ message: 'JSON eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar el JSON:', error);
      res.status(500).json({ error: 'Error al eliminar el JSON.' });
    }
  };
  



  module.exports = {
    renderProducto,
    obtenerProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
};