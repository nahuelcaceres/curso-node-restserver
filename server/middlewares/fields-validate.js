const { validationResult } = require('express-validator');

const fieldValidate = (req, res, next) => {
    try {
        const errors = validationResult(req);
    
        if( !errors.isEmpty()){
            return res.status(400).json(errors);
        }
    
        next();
        
    } catch (error) {
        console.log('fieldValidate -->', error);
    }
}

module.exports = {
    fieldValidate
};