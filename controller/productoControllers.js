const fs = require("fs");
const path = require('path');
const connection = require('../db');
const axios = require('axios');
const multer = require('multer');


function renderProducto (req,res){
    res.render("productos", {errors: []});
  };  



 
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  
  const createProduct = (req, res) => {
    const { nombre, descripcion, precio } = req.body;
  
    if (!nombre || !descripcion || !precio) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }
  
    let imagen = null;
    if (req.file) {
      imagen = req.file.buffer;
    }
  
    const insertProductQuery = `
      INSERT INTO productos (nombre, descripcion, precio, imagen)
      VALUES (?, ?, ?, ?)
    `;
    const values = [nombre, descripcion, precio, imagen];
    connection.query(insertProductQuery, values, (error, results) => {
      if (error) {
        console.log("Error al insertar producto en la base de datos:", error);
        res.status(500).json({ error: "Error al insertar producto en la base de datos" });
        return;
      }
  
      const id = results.insertId;
      const imagen_url = req.file ? `${req.protocol}://${req.get('host')}/${req.file.filename}` : null;
      const product = { id, nombre, descripcion, precio, imagen_url };
  
      console.log(`Producto ${product.nombre} agregado con éxito a la base de datos`);
  
      const productsFilePath = path.join(__dirname, "../productos.json");
      fs.readFile(productsFilePath, (error, data) => {
        if (error) {
          console.error(`Error al leer archivo de productos: ${error.message}`);
          return;
        }
  
        let products = JSON.parse(data.toString("utf-8"));
        products.push(product);
        fs.writeFile(productsFilePath, JSON.stringify(products), (error) => {
          if (error) {
            console.error(`Error al escribir archivo de productos: ${error.message}`);
          }
        });
  
        res.status(201).json({
          message: "Producto agregado con éxito",
          product: product,
        });
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
    const query = 'SELECT * FROM productos';
   
    connection.query(query, (error, results) => { 
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
};