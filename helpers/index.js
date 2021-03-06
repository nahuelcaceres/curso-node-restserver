
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerifty = require('./google-verify');
const encrypt = require('./encrypt');
const uploadFiles = require('./upload-files');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerifty,
    ...encrypt,
    ...uploadFiles,
};