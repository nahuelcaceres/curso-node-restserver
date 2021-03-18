
// Referencias HTML
const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    console.log('Haciendo auth.js.loginform()');
    const formData = {};

    for (let el of loginForm.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData), // serializamos la data,
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch((err) => {
            console.log(err);
        })

})



const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://curso-restserver-basic.herokuapp.com/api/auth/';


function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function onSignIn(googleUser) {

    // TODO: Como se hace esto correctamente?
    // Quiero hacer logout desde la pantalla chat.html
    if (localStorage.getItem('salir')) {
        localStorage.removeItem('salir');
        signOut();
        return;
    }

    var profile = googleUser.getBasicProfile();

    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    loadInformationFromUser(`Bienid@ ${profile.getName()} (${profile.getEmail()})`);

    var id_token = googleUser.getAuthResponse().id_token;

    const data = { id_token };

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(data => {
            console.log('Nuestro server', data)
            window.location = 'chat.html';
            localStorage.setItem('token', data.token);
        })
        .catch(console.log)
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {
        console.log('User signed out.');
        loadInformationFromUser('Acceso denegado')
    });
}

function loadInformationFromUser(name = 'Acceso denegado') {

    document.querySelector('#username').innerText = name;

}