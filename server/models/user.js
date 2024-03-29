
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
        default: 'USER_ROLE',
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
SchemaUser.methods.toJSON = function () {
    try {
        const { __v, password, _id, ...user } = this.toObject();
    
        user.uid = _id;
    
        return user;
        
    } catch (error) {
        console.log('user.toJSON -->', error);
    }
}

SchemaUser.methods.wrapper = function() {
    try {
         const {_id, password, ...user} = this.toObject();

         return user;

    } catch (error) {
        console.log('user.wrapper -->', error);
    }
}

// SchemaUser.pre('find', function (next) {
//     console.log("Pre Find", this._id);
//     next();
// });

// SchemaUser.pre('findOne', function (next) {
//     console.log("Pre Find One");
//     next();
// });

module.exports = model('User', SchemaUser);