const express = require("express");
const multer = require('multer');
const router = express.Router();

 
  // Configuración de multer para la subida de archivos
  const multerConfig = {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024 * 5, // Limite de 5 MB
    },
    fileFilter: (req, file, next) => {
      if (!file || !file.mimetype.includes("image")) {
        return next(new Error("El archivo debe ser una imagen"));
      }
      next(null, true);
    },
  };

//productos
const {createProduct, renderProducto, actualizarProducto, eliminarProducto, getProductoById} = require("../controller/productoControllers");
const validateProducto = require("../middleware/validateProducto");

//ruta productos
router.get("/agregar-productos", renderProducto);
router.post("/agregar-productos", multer(multerConfig).single("imagen"), createProduct, validateProducto);
router.get("/productos/:id",  getProductoById);
router.put("/actualizar-productos/:id", validateProducto,actualizarProducto );
router.delete("/eliminar-productos/:id", eliminarProducto);




module.exports = router;