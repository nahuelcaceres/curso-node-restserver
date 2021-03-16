
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://curso-restserver-basic.herokuapp.com/api/auth/';

let authenticatedUser = null;
let socket = null;

//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulMensajesPrivados = document.querySelector('#ulMensajesPrivados');
const btnSalir = document.querySelector('#btnSalir');

//Events listeners
txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode !== 13) { return; }

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';
})

btnSalir.addEventListener('click', (evt) => {
    evt.preventDefault();
    
    localStorage.removeItem('token');
    localStorage.setItem('salir', true);
    
    window.location = 'index.html';
})

const jwtValidate = async () => {

    const token = localStorage.getItem('token');

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const response = await fetch(url, {
        headers: { 'x-token': token },
    });

    const { authUser: userDB, token: tokenDB } = await response.json();

    localStorage.setItem('token', tokenDB);

    authenticatedUser = userDB;

    document.title = authenticatedUser.name;

    await socketConnect();
};

const socketConnect = () => {

    // Hacemos la conexion
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', (payload) => {
        console.log('recibir-mensajes', payload);
        dibujarMensajes(payload);
    });

    socket.on('usuarios-activos', (payload) => {
        console.log(payload);
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload);
        dibujarMensajesPrivados(payload);
    });
};

const dibujarUsuarios = (usuarios = []) => {
    let usuariosHtml = '';

    usuarios.forEach(({ name, uid }) => {
        usuariosHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5> 
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
         `;
    })

    ulUsuarios.innerHTML = usuariosHtml;

    ulUsuarios.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log(evt.target);
        txtUid.value = evt.path[1].children[2].outerText;
    })
};

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span> 
                    <span >${mensaje}</span>
                </p>
            </li>
         `;
    })

    ulMensajes.innerHTML = mensajesHtml;
};

const dibujarMensajesPrivados = ({ de, uid, mensaje }) => {

    let mensajesHtml = `
            <li onclick="${getUId}" data-id=${uid}>
                <p>
                    <span class="text-primary">${de}</span> 
                    <span >${mensaje}</span>
                </p>
            </li>
         `;

    ulMensajesPrivados.innerHTML += mensajesHtml;

    // ulMensajesPrivados.addEventListener('click', (evt) => {
    //     evt.preventDefault();
    //     console.log(evt.target);
    //     console.log(evt.currentTarget);
    //     //txtUid.value = evt.path[1].children[2].outerText;
    // })
};

function getUId(evt){
    evt.preventDefault();

    console.log(evt.currentTarget);
}

const main = async () => {

    await jwtValidate();

};

main();


// Hacemos la conexion
//const socket = io();