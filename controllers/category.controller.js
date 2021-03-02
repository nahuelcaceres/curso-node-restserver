const ObjectID = require('mongodb').ObjectID;
const Category = require('../models/category');

const getCategories = async(req,res) => {

    const { limit = 5, from = 0} = req.query ;
    const query = { status: true };

    const [ entries, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate( 'user', 'name')
            .skip( Number( from ))
            .limit( Number( limit ))
    ]);

    res.status(200).json({
       entries,
       categories
    })

};

const getCategory = async(req,res) => {
    const {id} = req.params;

    const category = await Category.findById( id ).populate('user', 'name');

    return res.status(200).json({category});
};

const createCategory = async(req, res) => {

    try {
        const name = req.body.name.toUpperCase();
    
        const category = await Category.findOne({ name });
    
        if ( category ){
            return res.status(400).json({
                msg: `La categoria ${ category.name }, ya existe `,
            });
        }
    

        const data = {
            name,
            user: req.authUser._id,
        };

        const newCategory = new Category( data );
        await newCategory.save();
    
        return res.status(201).json(newCategory);
        
    } catch (err) {
       console.log('Catch: ', {err});
    }
};

const updateCategory = async(req,res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.authUser._id;

    const category = await Category.findByIdAndUpdate({'_id': ObjectID(id)}, data, { new: true});

    res.json( {category} );
};

const deleteCategory = async(req,res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, {status: false}, {new: true});

    res.status(201).json(category);
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};