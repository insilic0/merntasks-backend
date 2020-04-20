const express = require('express');
const router = express.Router();
const proyectoController = require('../controller/proyectoController');
const authMiddle = require('../middleware/authMiddle');
const { check } = require('express-validator');

//Crea un proyecto
// api/proyectos
router.post('/',
    authMiddle,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

router.get('/',
    authMiddle,
    proyectoController.obtenerProyectos
);

router.put('/:id',
    authMiddle,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

router.delete('/:id',
    authMiddle,
    proyectoController.eliminarProyecto
);

module.exports = router;