const ObjectID = require('mongodb').ObjectID;
const User = require('../models/user');
const { encryptPassword } = require('../helpers/encrypt');

const usersGet = async(req, res) => {
    
    const { limit = 5, from = 0} = req.query ;
    const query = { status: true };

    const [ entries, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( from ))
            .limit( Number( limit ))
    ]);

    res.status(200).json({
       entries,
       users
    })

}

const usersPut = async(req, res) => {

    try {
        const { id } = req.params;
        const { _id, password, google, email, ...rest} = req.body;
    
        // TODO: validate with db
        if ( password ){
            rest.password = encryptPassword( password );
        }
    
        const user = await User.findByIdAndUpdate( id, rest);
    
        res.status(200).json({
            message: 'put API - controller',
            user
        })
        
    } catch (err) {
        console.log('Update:', err);  
    }

}

const usersPost = async(req, res) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encrypt password
    user.password = encryptPassword( password );

    await user.save();

    res.status(200).json({
        message: 'post API - controller',
        user
    })

};

const usersDelete = async(req, res) => {

    const { id } = req.params;
    // Hard delete
    //const user = await User.findByIdAndDelete( id );

    try {
        
        const user = await User.findByIdAndUpdate({'_id': ObjectID(id)} , { status: false });

    } catch (err) {
        console.log({err});        
    } 

    res.status(200).json({
        user
    });
};

const usersPatch = (req, res) => {
    res.status(200).json({
        message: 'patch API - controller',
    })
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
};