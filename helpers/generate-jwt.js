const jwt = require('jsonwebtoken');

const generateJWT = ( uid = '' ) => {

    return new Promise((resolve, reject) => {

        const payload = { uid };
        console.log({ uid });
        jwt.sign( payload, process.env.JWT_SECRET_OR_PRIVATE_KEY, {
            expiresIn: '4h',

        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                console.log({token});
                resolve(token);
            }
        })

    })
};

module.exports = {
    generateJWT
};