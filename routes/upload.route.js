
const { Router } = require('express');
const { check } = require('express-validator');

const { upload, updateImage, showImage, updateCloudinaryImage } = require('../controllers/upload.controller');
const { validCollections } = require('../helpers');
const { fieldValidate } = require('../middlewares/fields-validate');
const { validateFileUpload } = require('../middlewares/file-validate');

const router = Router();

router.post('/', validateFileUpload, upload)


router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'El id debe ser de mong').isMongoId(),
    check('collection').custom( c => validCollections(c, ['users', 'products'])),
    fieldValidate
], updateCloudinaryImage);//updateImage)

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mong').isMongoId(),
    check('collection').custom( c => validCollections(c, ['users', 'products'])),
    fieldValidate
], showImage)


module.exports = router;