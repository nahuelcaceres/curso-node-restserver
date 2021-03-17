const path = require('path');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config.db');
const { socketController } = require('../sockets/socket.controller');
const { response } = require('express');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server= createServer( this.app );
        this.io = require('socket.io')(this.server);

        this.authRoute = '/api/auth';
        this.categoriesRoute = '/api/categories';
        this.searchesRoute = '/api/searches';
        this.productsRoute = '/api/products';
        this.uploadsRoute = '/api/uploads';
        this.usersRoute = '/api/users';

        // Connect to database
        this.connectDatabase();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes()

        // Sockets
        this.sockets();
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
        // this.app.use( express.static('public')); //Cambio para probar React
        this.app.use( express.static( path.resolve(__dirname, '../client/build')))
        
        // Fileupload - Load file
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use( this.authRoute , require('../routes/auth.route'));    
        this.app.use( this.categoriesRoute , require('../routes/category.route'));    
        this.app.use( this.searchesRoute , require('../routes/search.route'));    
        this.app.use( this.productsRoute , require('../routes/product.route'));    
        this.app.use( this.uploadsRoute , require('../routes/upload.route'));    
        this.app.use( this.usersRoute , require('../routes/user.route')); 

        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
        })
    };

    sockets() {
        //this.io.on('connection', socketController);
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    };

    listen() {
        // this.app.listen( this.port, () => {
        this.server.listen( this.port, () => { 
            console.log('Servidor corriendo en puerto', this.port);
        })
    };
}

module.exports = Server;