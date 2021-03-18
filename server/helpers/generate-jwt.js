const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const { User } = require('../models/');

const generateJWT = ( uid = '' ) => {

    try {
        return new Promise((resolve, reject) => {
    
            const payload = { uid };
    
            jwt.sign( payload, process.env.JWT_SECRET_OR_PRIVATE_KEY, {
                expiresIn: '4h',
    
            }, (err, token) => {
    
                if(err){
                    console.log('generate-jwt -->',err);
                    reject('No se pudo generar el token');
                } else {
                    //console.log({token});
                    resolve(token);
                }
            })
    
        })
        
    } catch (error) {
        console.log('generateJWT -->', error);
    }
};

const checkJWT = async ( token = '' ) => {

    try {
       if ( token.length < 10) {
           return null;
       } 
       const { uid } = jwt.verify( token, process.env.JWT_SECRET_OR_PRIVATE_KEY);

       const user = await User.findById( {'_id': ObjectID(uid.uid)} );

       if ( user ) {
           if ( user.status ) {
               return user;
           }else {
               return null
           }
       } else {
           return null
       }

    } catch (err) {
        console.log('Error en checkJWT', err);
        return null; 
    }
};

module.exports = {
    generateJWT,
    checkJWT
};