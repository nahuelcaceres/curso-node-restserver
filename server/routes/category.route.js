const { Router } = require('express');
const { check } = require('express-validator');

const { create, getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { categoryExistById } = require('../helpers/db-validators');

const { fieldValidate } = require('../middlewares/fields-validate');
const { jwtValidate } = require('../middlewares/jwt-validate');
const { isRoleAdmin } = require('../middlewares/roles-validate');

const router = Router();

router.get('/', getCategories)

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( categoryExistById ),
    fieldValidate,
], getCategory)

// Crear categoria - privado - solo usuarios con token
router.post('/', [
    jwtValidate,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldValidate,
], createCategory)

// Actualizar - privado - solo usuarios con token
router.put('/:id', [
    jwtValidate,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( categoryExistById ),
    fieldValidate,
], updateCategory)

// Borrar - privado - solo Admin
router.delete('/:id', [
    jwtValidate,
    isRoleAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( categoryExistById ),
    fieldValidate
], deleteCategory)

module.exports = router;