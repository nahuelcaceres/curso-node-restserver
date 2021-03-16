const { checkJWT } = require("../helpers");
const { Chat } = require('../models');

const chat = new Chat();

const socketController = async (socket, io) => {

    const token = socket.handshake.headers['x-token'];

    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chat.conectarUsuario(user);
    io.emit('usuarios-activos', chat.usuariosArray);

    // Al que se conecta (socket), solo a el le enviamos los ultimos mensajes
    socket.emit('recibir-mensajes', chat.ultimos );

    // Conectar el socket tambien a una "sala privada"
    socket.join( user.id );

    // Quitar el usuario desconectado
    socket.on('disconnect', () => {
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