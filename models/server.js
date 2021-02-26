const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config.db');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.usersRoute = '/api/users';
        this.authRoute = '/api/auth'

        // Connect to database
        this.connectDatabase();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes()
    }

    async connectDatabase(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Body Parser
        this.app.use( express.json() ); 

        //Public directory
        this.app.use( express.static('public'));

    }

    routes() {

        this.app.use( this.authRoute , require('../routes/auth.route'));    
        this.app.use( this.usersRoute , require('../routes/user.route')); 

    };

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    };
}

module.exports = Server;