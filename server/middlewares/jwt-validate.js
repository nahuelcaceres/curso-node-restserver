const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
const User = require('../models/user');

const jwtValidate = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        // Verificamos que sea un token firmado por nuestro backend
        // de no serlo, jwt lanza una exception, la controlamos y salimos con false
        const { uid } = jwt.verify(token, process.env.JWT_SECRET_OR_PRIVATE_KEY);
        let id = '';

        try {
            if (uid.hasOwnProperty('role')) {
                id = uid.uid;
            }else {
                id = uid;
            }
        } catch (error) {
            console.log('load id -->', error);
        }

        const user = await User.findById({ '_id': ObjectID(id) });//( uid );

        if (!user) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe',
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false',
                user
            });
        }

        req.authUser = user;
        next();

    } catch (err) {
        console.log('jwtValidate -->', err);

        return res.status(401).json({
            msg: 'Token no valido',
        });
    }

    next();
};

module.exports = {
    jwtValidate
};