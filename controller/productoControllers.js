const fs = require("fs");
const path = require('path');


function renderProducto (req,res){
    res.render("productos", {errors: []});
  };
  

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
    const dataFilePath = path.join(__dirname, "../productos.json");

    const productIdToUpdate = parseInt(req.params.id); 

    const productos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    const productoIndex = productos.findIndex(producto => producto.id === productIdToUpdate);

    if (productoIndex !== -1) {
            productos.splice(productoIndex, 1);

      productos.push({ id: productIdToUpdate, ...req.body });

      fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2));

      res.status(200).json({ message: 'Producto actualizado exitosamente.' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    console.error('Error al actualizar el Producto:', error);
    res.status(500).json({ error: 'Error al actualizar el Producto.' });
  }
}

  // Eliminar
  
   
  function eliminarProducto(req, res) {
    try {
      const dataFilePath = path.join(__dirname, "../productos.json");
      const productIdToDelete = parseInt(req.params.id); // Suponemos que el ID del usuario a eliminar se pasa como parámetro en la URL
  
      // Leer los usuarios actuales del archivo JSON
      const productos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
      // Encontrar el índice del usuario a eliminar en base a su ID
      const productosIndex = productos.findIndex(producto => producto.id === productIdToDelete);
  
      if (productosIndex !== -1) {
        // Eliminar el usuario de la matriz de usuarios por su índice
        productos.splice(productosIndex, 1);
  
        // Escribir la matriz actualizada de usuarios de nuevo en el archivo JSON
        fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2));
  
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      console.error('Error al eliminar el Producto:', error);
      res.status(500).json({ error: 'Error al eliminar el Producto.' });
    }
  }



  module.exports = {
    renderProducto,
    obtenerProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
};