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

    try {
      // Obtiene el contenido actual del archivo productos.json
      const productosJsonPath = path.join(__dirname, '../productos.json');
      const productosJsonData = fs.readFileSync(productosJsonPath);

      // Parsea el contenido JSON y agrega el nuevo producto
      const productos = JSON.parse(productosJsonData);
      productos.push({ id, nombre, descripcion, categoria, precio, imagen });

      // Sobrescribe el archivo productos.json con la información actualizada
      const productosJsonString = JSON.stringify(productos, null, 2);
      fs.writeFileSync(productosJsonPath, productosJsonString);

      res.status(201).json({
        message: "Producto agregado con éxito",
        product: { id, nombre, descripcion, categoria, precio, hasImage: !!imagen },
      });
    } catch (error) {
      console.log("Error al agregar el nuevo producto:", error);
      res.status(500).json({ error: "Error al agregar el nuevo producto" });
    }
  });
};
  
  //encontrar por id 
  const getProductoById = (req, res) => {
    const id = req.params.id;
  
    const query = 'SELECT * FROM productos WHERE id = ?';
  
    connection.query(query, [id], (error, results) => {
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
  
      // Crea una URL de imagen si el producto tiene una imagen
      const imagenUrl = producto.imagen ? `data:image/png;base64,${producto.imagen.toString("base64")}` : '';
  
      // Envía los detalles del producto a la vista
      res.render('detail_Products', {producto: producto});
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
    getProductoById,
    createProduct,
    actualizarProducto,
    eliminarProducto,
    getAllProductos,
    getProductosByCategoria,
};