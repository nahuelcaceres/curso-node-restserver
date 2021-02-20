const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.usersRoute = '/api/users';

        // Middlewares
        this.middlewares();

        // Routes
        this.routes()
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

       this.app.use( this.usersRoute , require('../routes/user.route')); 

    };

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    };
}

module.exports = Server;