const fs = require("fs");
const path = require('path');
const connection = require('../db');
const axios = require('axios');


function renderProducto (req,res){
    res.render("productos", {errors: []});
  };  


  const createProduct = (req, res) => {
    const { nombre, descripcion, categoria, precio } = req.body;
  
    if (!nombre || !descripcion || !precio) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }
  
    // En lugar de generar el ID manualmente, dejamos que MySQL lo genere automáticamente
    const insertProductQuery = `INSERT INTO productos (nombre, descripcion, categoria_id, precio, imagen) VALUES (?, ?, ?, ?, ?)`;
  
    // Convierte la imagen a un Buffer
    const imagen = req.file ? req.file.buffer : null;
   
    const values = [nombre, descripcion, categoria, precio, imagen];
  
    // Inserta el nuevo producto en la base de datos
    connection.query(insertProductQuery, values, (error, results) => {
      if (error) {
        console.log("Error al insertar producto en la base de datos:", error);
        res.status(500).json({ error: "Error al insertar producto en la base de datos" });
        return;
      }
  
      // Obtiene el ID generado automáticamente por MySQL
      const id = results.insertId;
  
      console.log(`Producto ${nombre} agregado con éxito a la base de datos con ID ${id}`);
  
      // Renderiza la vista de detalle del nuevo producto recién agregado
      connection.query("SELECT * FROM productos WHERE id = ?", [id], (error, result) => {
        if (error) throw error;
        const producto = result[0];
        // Convierte la imagen a una cadena base64 para mostrarla en la vista
        const imagenBase64 = Buffer.from(producto.imagen).toString("base64");
        res.render("detail_Products.ejs", { producto, imagenBase64 });
      });
    });
  };
  
  //encontrar por id 
  const getProductoById = (req, res) => {
    const id = req.params.id;
  
    const query = 'SELECT * FROM productos WHERE id = ?';
  
    connection.query(query, [id], (error, results, fields) => {
      if (error) {
        console.log("Error al obtener el producto de la base de datos:", error);
        res.status(500).json({ error: "Error al obtener el producto de la base de datos" });
        return;
      }
  
      // Si no hay resultados, significa que el ID no es válido
      if (results.length === 0) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }
  
      // Obtiene el primer resultado (el producto único con ese ID)
      const producto = results[0];
  
      console.log(`Detalles del producto ${producto.nombre} (ID ${id}):`, producto);
  
      let imagenBase64 = null; // Inicializa imagenBase64 como null
  
      // Si el registro del producto contiene una imagen, la convierte a Base64
      if (producto.imagen) {
        imagenBase64 = Buffer.from(producto.imagen, 'binary').toString('base64'); // Convierte los datos de imagen a Base64
      }
  
      // Envía los detalles del producto a la vista, junto con la imagen como Base64
      res.render('detail_Products', {
        producto: producto,
        imagenBase64: imagenBase64
      });
    });
  };

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
      const productIdToDelete = parseInt(req.params.id);
  
      const deleteQuery = "DELETE FROM productos WHERE id = ?";
  
      connection.query(deleteQuery, [productIdToDelete], (error, results) => {
        if (error) {
          console.error('Error al eliminar el producto de la base de datos:', error);
          res.status(500).json({ error: 'Error al eliminar el producto de la base de datos.' });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Producto no encontrado.' });
        } else {
          res.status(200).json({ message: 'Producto eliminado exitosamente.' });
        }
      });
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
  
      const productos = results.map((producto) => {
        return {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria_nombre, 
          precio: producto.precio,
         
        };
      });
  
    
      res.json({ productos });
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
    getProductoById,
    createProduct,
    actualizarProducto,
    eliminarProducto,
    getAllProductos,
    getProductosByCategoria,
};