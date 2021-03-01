const ObjectID = require('mongodb').ObjectID;
const { Product } = require('../models');

const getProducts = async(req,res) => {

    const { limit = 5, from = 0} = req.query ;
    const query = { status: true };

    const [ entries, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate( 'user', 'name')
            .populate( 'category', 'name')
            .skip( Number( from ))
            .limit( Number( limit ))
    ]);

    res.status(200).json({
       entries,
       categories: products
    })

};

const getProduct = async(req,res) => {
    const {id} = req.params;

    const product = await Product.findById( id )
                                .populate('user', 'name')
                                .populate('category', 'name');

    return res.status(200).json({product: product});
};

const createProduct = async(req, res) => {

    try {
        const { status, user, ...body } = req.body;
    
        const product = await Product.findOne( {name: body.name} );
    
        if ( product ){
            return res.status(400).json({
                msg: `El product ${ product.name }, ya existe `,
            });
        }
    

        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.authUser._id,
        };

        const newProduct = new Product( data );
        await newProduct.save();
    
        res.status(201).json(newProduct);
        
    } catch (err) {
       console.log('Catch: ', {err});
    }
};

const updateProduct = async(req,res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if ( data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.authUser._id;

    const product = await Product.findByIdAndUpdate({'_id': ObjectID(id)}, data, { new: true});

    res.json( product );
};

const deleteProduct = async(req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate( id, {status: false}, {new: true});

    res.status(201).json(product);
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
}