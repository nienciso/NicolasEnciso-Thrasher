const {body, validationResult} = require("express-validator");

const validateProducto = [
    
    //  parametros //
    body("nombre")
    .notEmpty()
    .withMessage("Debes completar el campo nombre"),
    body("descripcion")
    .notEmpty()
    .withMessage("Debes ingresar una descripcion valida"),
    body("precio")
    .notEmpty()
    .withMessage("Debes ingresar el precio"),

    // logica de middleware //

    (req , res , next) => {
        const errors =validationResult(req);
        if(!errors.isEmpty()) {
            return res.render("productos", {
                errors: errors.array(),
            });
        }
        next();
    },
];

// exportamos //

module.exports = validateProducto;