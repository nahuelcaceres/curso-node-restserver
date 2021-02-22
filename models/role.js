
const { Schema, model } = require('mongoose');

const SchemaRole = Schema({
    role: {
        type: String,
        required: [true, 'Role fild is required'],
    },
});

module.exports = model( 'Role', SchemaRole );