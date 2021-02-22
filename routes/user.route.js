
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/user.controller') ;

const { fieldValidate } = require('../middlewares/fields-validate');
const { validRole, emailAlreadyExist, userExistById} = require('../helpers/db-validators');


router.get('/', usersGet );

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( (id) => userExistById( id )),
    check('role').custom( (role) => validRole(role) ),
    fieldValidate
], usersPut );

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({ min: 6 }),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom( (email) => emailAlreadyExist(email)),
    check('role').custom( (role) => validRole(role) ),
    fieldValidate
], usersPost );

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( (id) => userExistById( id )),
    fieldValidate
], usersDelete );

router.patch('/', usersPatch ); 

module.exports = router;