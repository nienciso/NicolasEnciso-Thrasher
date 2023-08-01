const {body, validationResult} = require("express-validator");

const validateRegister = [
    
    //  parametros //

    body("name")
    .notEmpty()
    .withMessage("Debes completar el campo nombre"),
    body("name_usuario")
    .notEmpty()
    .withMessage("Debes ingresar un nombre de usuario valido"),
    body("email")
    .notEmpty()
    .withMessage("Debes completar el campo email")
    .bail()
    .isEmail()
    .withMessage("Debes ingresar un email valido"),
    body("password")
    .notEmpty()
    .withMessage("Debes ingresar una contraseña valida"),
    body("password_repeat")
    .notEmpty()
    .withMessage("Debes confirmar la contraseña"),
    body("date")
    .notEmpty()
    .withMessage("Debes ingresar tu fecha de nacimiento"),
    body("telefono")
    .notEmpty()
    .withMessage("Debes ingresar un numero de telefono"),
    body("pais")
    .notEmpty()
    .withMessage("Debes ingresar tu pais de residencia"),
    body("genero")
    .notEmpty()
    .withMessage("Debes seleccionar tu genero"),
    

    // logica de middleware //

    (req , res , next) => {
        const errors =validationResult(req);
        if(!errors.isEmpty()) {
            return res.render("register", {
                errors: errors.array(),
            });
        }
        next();
    },
];

// exportamos //

module.exports = validateRegister;