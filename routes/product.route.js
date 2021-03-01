const { Router } = require('express');
const { check } = require('express-validator');

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/Product.controller');
const { productExistById, categoryExistById } = require('../helpers/db-validators');

const { fieldValidate } = require('../middlewares/fields-validate');
const { jwtValidate } = require('../middlewares/jwt-validate');
const { isRoleAdmin } = require('../middlewares/roles-validate');

const router = Router();

router.get('/', getProducts)

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( productExistById ),
    fieldValidate,
], getProduct)

// Crear categoria - privado - solo usuarios con token
router.post('/', [
    jwtValidate,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id de Mongo').isMongoId(),
    check('category').custom( categoryExistById ),
    fieldValidate,
], createProduct)

// Actualizar - privado - solo usuarios con token
router.put('/:id', [
    jwtValidate,
    check('id').custom( productExistById ),
    fieldValidate,
], updateProduct)

// Borrar - privado - solo Admin
router.delete('/:id', [
    jwtValidate,
    isRoleAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( productExistById ),
    fieldValidate
], deleteProduct)

module.exports = router;