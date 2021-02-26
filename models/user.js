
const { Schema, model } = require('mongoose');

const SchemaUser = Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

// Como hacemos uso del this, no podemos usar una arrow function
SchemaUser.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();

    user.uid = _id;

    return user;
} 

module.exports = model('User', SchemaUser);