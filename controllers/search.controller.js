const {ObjectId} = require('mongoose').Types;
const {User} = require('../models');
const {Product} = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles',
];

const usersFind = async(criteria = '', res) => {

    const isMongoId = ObjetcId.isValid( criteria );

    if (isMongoId) {
        const user = await User.findById( criteria );

        return res.status().json({
            results: (user) ? [user] : []
        });
    }

    const regexp = new RegExp( criteria, 'i');
    const users = await User.find({ 
        $or: [{name: regexp}, {email: regexp}],
        $and: [{status: true}] 
    });
    
    return res.status(200).json({
        results: users
    });
};

const categoriesFind = async(criteria = '', res) => {

    const isMongoId = ObjetcId.isValid( criteria );

    if (isMongoId) {
        const category = await Category.findById( criteria );

        return res.status().json({
            results: (category) ? [category] : []
        });
    }

    const regexp = new RegExp( criteria, 'i');
    const categories = await User.find({ name: regexp, status: true });
    
    return res.status(200).json({
        results: categories
    });
};

const productsFind = async(criteria = '', res) => {

    const isMongoId = ObjectId.isValid( criteria );

    if (isMongoId) {
        const product = await Product.findById( criteria ).populate('category', 'name');

        return res.status(200).json({
            results: (product) ? [product] : []
        });
    }

    const regexp = new RegExp( criteria, 'i');
    const products = await User.find({ name: regexp, status: true }).populate('category', 'name');
    
    return res.status(200).json({
        results: products
    });
};


const find = (req, res) => {

    const { collection, criteria } = req.params;

    if (!allowedCollections.includes( collection )){
        return res.status(400).json({
            msg: `Las coleccines permitidas son: ${ allowedCollections }`,
        });
    }

    switch (collection) {
        case 'users':
            usersFind(criteria, res);
            break;

        case 'categories':
            categoriesFind(criteria, res);
            break;

        case 'products':
            productsFind(criteria, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Opcion de busqueda no implementada ',
            })
    }
   
};

module.exports = {
    find,

};