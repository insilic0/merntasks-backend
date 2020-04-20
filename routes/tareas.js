const express = require('express');
const router = express.Router();
const tareaController = require('../controller/tareaController');
const authMiddle = require('../middleware/authMiddle');
const { check } = require('express-validator');

router.post('/',
    authMiddle,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

router.get('/',
    authMiddle,
    tareaController.obtenerTareas
)

router.put('/:id',
    authMiddle,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
)

router.delete('/:id',
    authMiddle,
    tareaController.eliminarTarea
)

module.exports = router;