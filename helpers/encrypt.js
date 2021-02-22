
const bcryptjs = require('bcryptjs');

const encryptPassword = ( password ) => {
    const salt = bcryptjs.genSaltSync();

    return bcryptjs.hashSync( password, salt);
}

module.exports = {
    encryptPassword
};