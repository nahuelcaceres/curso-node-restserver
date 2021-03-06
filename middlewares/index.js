const fieldValidate = require('../middlewares/fields-validate');
const jwtValidate = require('../middlewares/jwt-validate');
const rolesValidate = require('../middlewares/roles-validate'); //isRoleAdmin, hasRole } = require('../middlewares/roles-validate');
const validateFileUpload = require('../middlewares/file-validate'); //isRoleAdmin, hasRole } = require('../middlewares/roles-validate');

module.exports = {
    ...fieldValidate, //Exporta todas las funciones (que exporte) el modulo
    ...jwtValidate,
    ...rolesValidate,
    ...validateFileUpload,
};