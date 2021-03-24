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
        // this.io = require('socket.io')(this.server);

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

        this.io = require('socket.io')(this.server, {
            cors: {
                origin: "localhost:3000", //your website origin
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true
            }
        });
        // Sockets
        this.sockets();
    }

    async connectDatabase(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        const allowedDomains = ['https://chat-nmc.herokuapp.com/', 'http://localhost:8080/'];
        this.app.use( cors({
            origin: function(origin, callback){
                //bypass the requests with no origin (like, curl requests, mobile app, etc)
                // console.log('estoy validadndo el origen', origin);
                //if(!origin) return callback(null, true);
                
                if (allowedDomains.indexOf(origin)=== -1) {
                    const msg = `This site ${origin} does not have an access. Only specifiy domains are allowed to access it.`;
                    return callback(msg, false);
                }

                return callback(null, true);
            }
        }) );
        // this.app.options( '*', cors());

        // Body Parser
        this.app.use( express.json() ); 

        //Public directory
        this.app.use( express.static('public') ); //Cambio para probar React
        //this.app.use( express.static( path.resolve(__dirname, '../../client/build')))
        
        // Fileupload - Load file
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        //Puedo interceptar todo en el momento de responder y hacer algo.
        // this.app.use(async (req, res, next) => {
            // res.send = function(data){
                // console.log(res);
            // }
            // next();
        // } )

        this.app.use( this.authRoute , require('../routes/auth.route'));    
        this.app.use( this.categoriesRoute , require('../routes/category.route'));    
        this.app.use( this.searchesRoute , require('../routes/search.route'));    
        this.app.use( this.productsRoute , require('../routes/product.route'));    
        this.app.use( this.uploadsRoute , require('../routes/upload.route'));    
        this.app.use( this.usersRoute , require('../routes/user.route')); 
        
        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, './client', 'index.html'));
        })
    };

    sockets() {
        //this.io.on('connection', socketController);
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )

        /* this.io.cors = {
            origin: '*',
            methods: ["GET", "PUT", "POST", "DELETE"],
            allowedHeaders: ['x-token'] ,
            credentials: true
        } */
    };

    listen() {
        // this.app.listen( this.port, () => {
        this.server.listen( this.port, () => { 
            console.log('Servidor corriendo en puerto', this.port);
        })
    };
}

module.exports = Server;