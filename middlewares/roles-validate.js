
const isRoleAdmin = (req, res, next) => {

    if ( !req.authUser ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero',
        }); 
    }

    const { role, name } = req.authUser;

    if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ name } no es un administrador - No puede hacer esta accion`,
        });
    }
    

    next();
};

const hasRole = ( ...roles ) => { 

    return ( req, res, next ) => {

        if ( !req.authUser ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero',
            });
        }

        if ( !roles.includes( req.authUser.role )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`,
            });
        }

        next();
    }
};

module.exports = {
    isRoleAdmin,
    hasRole
};