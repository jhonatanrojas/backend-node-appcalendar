
//obtener eventos
/**
 * Rutas de eventos
 * host + /api/events
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/eventsController');   
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(validarJWT);

//obtener eventos
router.get('/', getEventos);

//crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha debe ser válida').custom(isDate),
        check('end', 'La fecha de finalización debe ser válida').custom(isDate),
        validarCampos
    ],
    crearEvento
);

//actualizar
router.put('/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio debe ser válida').custom(isDate),
        check('end', 'La fecha de finalización debe ser válida').custom(isDate),            
        validarCampos
    ],
    actualizarEvento
);

//eliminar
router.delete('/:id', eliminarEvento);

module.exports = [
    router
]