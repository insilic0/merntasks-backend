//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controller/authController');
const authMiddle = require('../middleware/authMiddle');

//Iniciar Sesion
// api/auth

router.post('/',
    authController.autenticarUsuario
);
router.get('/',
    authMiddle,
    authController.usuarioAutenticado
);

module.exports = router;