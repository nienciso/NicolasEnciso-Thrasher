const fs = require("fs");
const path = require('path');
const connection = require('../db');
const axios = require('axios');
const multer = require('multer');


function renderProducto (req,res){
    res.render("productos", {errors: []});
  };  


  const createProduct = (req, res) => {
    const { nombre, descripcion, categoria, precio } = req.body;
  
    if (!nombre || !descripcion || !precio) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

  
    const insertProductQuery = `INSERT INTO productos (nombre, descripcion, categoria_id, precio, imagen) VALUES (?, ?, ?, ?, ?)`;
  
    // Convierte la imagen a un Buffer
    const imagen = req.file ? req.file.buffer : null;
    console.log(imagen)
    const values = [nombre, descripcion, categoria, precio, imagen];

    connection.query(insertProductQuery, values, (error, results) => {
      if (error) {
        console.log("Error al insertar producto en la base de datos:", error);
        res.status(500).json({ error: "Error al insertar producto en la base de datos" });
        return;
      }
  
      const id = results.insertId;
      const product = { id, nombre, descripcion, categoria, precio, imagen};
  
      console.log(`Producto ${product.nombre} agregado con éxito a la base de datos`);
  
      res.status(201).json({
        message: "Producto agregado con éxito",
        product: product,
      });
    });
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

  const getAllProductos = (req, res) => {
    const query = 'SELECT p.*, c.nombre AS categoria_nombre FROM productos p JOIN categoria c ON p.categoria_id = c.id';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error al obtener los productos de la base de datos:", error);
        res.status(500).json({ error: "Error al obtener los productos de la base de datos" });
        return;
      }
  
      // Crea un nuevo array con los productos y su URL de imagen
      const productos = results.map((producto) => {
        const imagenUrl = producto.imagen ? `data:image/png;base64,${producto.imagen.toString("base64")}` : '';
        return {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria_id,
          precio: producto.precio,
          imagen: imagenUrl,
        };
      });
  
      res.render('index', { productos });
    });
  };


   const getProductosByCategoria = (req, res) => {
    const categoria_id = req.params.categoria_id;
    const query = 'SELECT * FROM productos WHERE categoria_id = ?';
  
    connection.query(query, [categoria_id], (error, results) => {
      if (error) throw error;
  
      res.render('index', { productos: results });
    });
  };
   
  


  module.exports = {
    renderProducto,
    obtenerProductoPorId,
    createProduct,
    actualizarProducto,
    eliminarProducto,
    getAllProductos,
    getProductosByCategoria 
};