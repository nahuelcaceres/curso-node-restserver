const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        
        await mongoose.connect( process.env.MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Database ready.');

    } catch (err) {
        console.log(err);
        throw new Error('Error to start database') 
    }
}


module.exports = {
    dbConnection
}