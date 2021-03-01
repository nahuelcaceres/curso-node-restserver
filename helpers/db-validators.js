const { Category } = require('../models');
const { Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const validRole = async (role = '') => {
    const roleExist = await Role.findOne({ role });

    if( !roleExist){
        throw new Error(`El role ${ role } no esta registrado en la DB`)
    }
}

const emailAlreadyExist = async ( email = '') => {
    const userExist = await User.findOne({ email }) ;

    if ( userExist ) {
        throw new Error(`User already exist with email: ${ email }`);
    }
}   

const userExistById = async ( id ) => {

    try {
        const userExist = await User.findById({ id }) ;
    
        if ( !userExist ) {
            throw new Error(`Not exist any user with id: ${ id }`);
        }

    } catch (err) {
        //TODO: Buscar por que me da este error en el DELETE, 
        //      pero no cuando hago el findById en el POST
        console.log("Error trycacheado:", err);    
    }
}   

const categoryExistById = async ( id ) => {

    try {
        const categoryExist = await Category.findById( id ) ;
    
        if ( !categoryExist ) {
            throw new Error(`Not exist any user with id: ${ id }`);
        }

    } catch (err) {
        //TODO: Buscar por que me da este error en el DELETE, 
        //      pero no cuando hago el findById en el POST
        console.log("Error trycacheado:", err);    
    }
}   

const productExistById = async ( id ) => {

    try {
        const productExist = await Product.findById( id ) ;
    
        if ( !productExist ) {
            throw new Error(`Not exist id: ${ id }`);
        }

    } catch (err) {
        //TODO: Buscar por que me da este error en el DELETE, 
        //      pero no cuando hago el findById en el POST
        console.log("Error trycacheado:", err);    
    }
}   

module.exports = {
    validRole,
    
    emailAlreadyExist,
    userExistById,

    categoryExistById,

    productExistById,
};