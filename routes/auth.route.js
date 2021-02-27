const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth.controller');
const { fieldValidate } = require('../middlewares/fields-validate');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldValidate
], login)

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    fieldValidate
], googleSignin)

module.exports = router;