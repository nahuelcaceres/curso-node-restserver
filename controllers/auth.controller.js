const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user');

const login = async(req, res) => {
    
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
       
        if (!user){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos',
            })
        }
        
        // Si el usuario esta activo
        if(!user.status){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - user.status: false',
            })
        }

        // Verificar contraseña
        const validatePassword = bcryptjs.compareSync( password, user.password);
        if(!validatePassword){
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - user.password: fail',
            })
        }

        // Genarar el JWT
        const token = await generateJWT( user.id );
        
        res.status(200).json({
            user,
            token,
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Hablar con el administrador',
            error
        }) 
    }

};

module.exports = {
    login
};