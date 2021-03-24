const { checkJWT } = require("../helpers");
const { Chat } = require('../models');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');
const chat = new Chat();

const socketController = async (socket, io) => {

    const token = socket.handshake.auth['x-token'];
    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }
    console.log('We have a new connection!!!');

    console.log(socket.handshake.auth['data'].uid);
    // Funcionalidad para react. 
    socket.on('join', ({uid, room}, callback) => {
        console.log('uid y room' , uid, room);

        const {error, user: userChat} = addUser({id: uid, name: user.name, room});
        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${userChat.name}, welcome to the room ${userChat.room}`})
        socket.broadcast.to(userChat.room).emit('message', {user: 'admin', text: `${userChat.name}, has joined!`})

        console.log('on join:', 'se agrega el usuario ', user.name, 'en la room:',room);
        socket.join(userChat.room);

        io.to(userChat.room).emit('roomData', {room: userChat.room, users: getUsersInRoom(userChat.room)})

        callback();
    });

    socket.on('sendMessage', (message, callback) => {

        console.log('on sendMessage', message);
        const user = getUser(socket.handshake.auth['data'].uid);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

        callback();
    })


    // Funcionalidad para html plano como front
    // Agregar el usuario conectado
    chat.conectarUsuario(user);
    io.emit('usuarios-activos', chat.usuariosArray);

    // Al que se conecta (socket), solo a el le enviamos los ultimos mensajes
    socket.emit('recibir-mensajes', chat.ultimos );

    // Conectar el socket tambien a una "sala privada"
    socket.join( user.id );

    // Quitar el usuario desconectado
    socket.on('disconnect', () => {
        const user = removeUser(socket.handshake.auth['data'].uid);
        if (user) {
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left.`})
        }
        
        chat.desconectarUsuario(user.id);
        io.emit('usuarios-activos', chat.usuariosArray);
    })

    socket.on('disconnect_', () => {
        console.log('se desconecto en react');
        chat.desconectarUsuario(user.id);
        io.emit('usuarios-activos', chat.usuariosArray);
    })
    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if( uid ){
            // Mensaje Privado

            socket.to( uid ).emit('mensaje-privado', { de: user.name, uid: uid, mensaje});

        }else{
            chat.enviarMensaje(user.id, user.name, mensaje);
    
            io.emit('recibir-mensajes', chat.ultimos);

        }

    })

};


module.exports = {
    socketController
};