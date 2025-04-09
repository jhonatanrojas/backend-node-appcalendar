
/**
 * Rutas de autenticación
 * host + /api/auth
 */


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const { validarCampos } = require('../middlewares/validar-campos');

const { check } = require('express-validator');
const { crearUsuario, renewToken, login } = require('../controllers/authController');


router.post('/new',
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
     ],
    crearUsuario);

router.post('/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], login);

router.get('/renew',validarJWT, renewToken);






module.exports = router;