const { Schema, model } = require('mongoose');

const SchemaCategory = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Como hacemos uso del this, no podemos usar una arrow function
SchemaCategory.methods.toJSON = function() {
    const {__v, status, ...data} = this.toObject();

    return data;
} 

module.exports = model( 'Category', SchemaCategory );