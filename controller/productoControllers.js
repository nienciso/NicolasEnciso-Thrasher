const fs = require("fs");
const path = require('path');
const connection = require('../db');

function renderProducto (req,res){
    res.render("productos", {errors: []});
  };  


const registrarProducto = (req, res) => {
  const { id, nombre, descripcion, precio } = req.body;
  const registrarNuevo = {
    id,
    nombre,
    descripcion,
    precio,
  };

  const dataFilePath = path.join(__dirname, "../productos.json");

  try {
    // Guardar los datos en la base de datos MySQL
    const insertQuery = "INSERT INTO productos (id, nombre, descripcion, precio) VALUES (?, ?, ?, ?)";

    connection.query(insertQuery, [id, nombre, descripcion, precio], (error, results) => {
      if (error) {
        console.error("Error al insertar el nuevo producto en la base de datos:", error);
        res.status(500).json({ error: "Error al insertar el nuevo producto en la base de datos." });
        return;
      }

      // Guardar los datos en el archivo JSON
      const productos = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
      productos.push(registrarNuevo);
      fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2), "utf-8");

      res.send("Nuevo producto agregado con éxito");
    });
  } catch (error) {
    console.error("Error al agregar el nuevo producto:", error);
    res.status(500).json({ error: "Error al agregar el nuevo producto." });
  }
};

process.on("SIGINT", () => {
  connection.end();
  console.log("Conexión a la base de datos MySQL cerrada");
  process.exit();
});

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
      
      productos[productoIndex] = { id: productIdToUpdate, ...req.body };

      
      fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2));

      
      const updateQuery = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?";

      connection.query(
        updateQuery,
        [req.body.nombre, req.body.descripcion, req.body.precio, productIdToUpdate],
        (error, results) => {
          if (error) {
            console.error('Error al actualizar el producto en la base de datos:', error);
            res.status(500).json({ error: 'Error al actualizar el producto en la base de datos.' });
          } else {
            res.status(200).json({ message: 'Producto actualizado exitosamente.' });
          }
        }
      );
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
}

  // Eliminar
  
   
  function eliminarProducto(req, res) {
    try {
      const dataFilePath = path.join(__dirname, "../productos.json");
      const productIdToDelete = parseInt(req.params.id); 
  
    
      const productos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
    
      const productosIndex = productos.findIndex(producto => producto.id === productIdToDelete);
  
      if (productosIndex !== -1) {
        
        productos.splice(productosIndex, 1);
  
        
        fs.writeFileSync(dataFilePath, JSON.stringify(productos, null, 2));
  
        
        const deleteQuery = "DELETE FROM productos WHERE id = ?";
  
        connection.query(deleteQuery, [productIdToDelete], (error, results) => {
          if (error) {
            console.error('Error al eliminar el producto de la base de datos:', error);
            res.status(500).json({ error: 'Error al eliminar el producto de la base de datos.' });
          } else {
            res.status(200).json({ message: 'Producto eliminado exitosamente.' });
          }
        });
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
  }




  module.exports = {
    renderProducto,
    obtenerProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto,
};