const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const User = require('../models/user');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos',
            })
        }

        // Si el usuario esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - user.status: false',
            })
        }

        // Verificar contraseña
        const validatePassword = bcryptjs.compareSync(password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                msg: 'Usuario/Contraseña no son correctos - user.password: fail',
            })
        }

        // Genarar el JWT
        const token = await generateJWT(user.id);

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

const googleSignin = async (req, res) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                img,
                email,
                password: 'N/C',
                google: true,
            };

            user = new User(data);

            await user.save();
        }

        if (!user.status) {
            // Si bien esta logueado a google y es valido..para mi negocio tiene
            // estado false y no puede usar el sistema.
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        }

        const token = await generateJWT(user.id);

        return res.status(200).json({
            user,
            token
        });

    } catch (error) {
        console.log('googleSigin -->', error);

        res.status(400).json({
            msg: 'Token de Google no es valido',
            error: error
        });
    }
};

const renewToken = async (req, res) => {
    const { authUser } = req;

    // Genarar el JWT
    const token = await generateJWT(authUser);

    res.json({
        authUser,
        token
    });
};

const verifyToken = async (req, res) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token;
    let email = req.body.email || req.query.email;

    //Hacer estas validaciones en el middleware
    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }

    if (!email) {
        return res.status(400).json({
            error: true,
            message: "Email is required."
        });
    }

    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET_OR_PRIVATE_KEY, async function (err, user) {
        if (err) return res.status(401).json({
            error: true,
            message: "Invalid token."
        });
        console.log('Que es este user qeu retonar JWT', user);
        // Hay que buscar el usuario para ese tocken y hacer la validacion.
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(400).json({
                error: true,
                msg: 'Usuario/Contraseña no son correctos',
            })
        }

        // Si el usuario esta activo
        if (!userDB.status) {
            return res.status(400).json({
                error: true,
                msg: 'Usuario/Contraseña no son correctos - user.status: false',
            })
        }

        // get basic user details
        // var userObj = utils.getCleanUser(userData);
        return res.json({ user: userDB, token });
    });
};

module.exports = {
    login,
    googleSignin,
    renewToken,
    verifyToken
};