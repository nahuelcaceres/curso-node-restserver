import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Users from '../components/Users/Users';
import { getToken } from '../utils/Common';

const Dashboard = (props) => {
    const [usuariosActivos, setUsuariosActivos] = useState([]);

    useEffect(() => {

        const socket = io('http://localhost:8080', {
            transports: ['websocket'],
            auth: { "x-token": getToken() },
        })

        socket.on("usuarios-activos", (data) => {
            console.log({ data });
            setUsuariosActivos(data);
        })
        
        //---- CLEAN UP THE EFFECT
        return (() => {
            socket.disconnect()
        });
        //-------------------------------

    }, [])

    // const handleLogout = () => {
    //     removeUserSession();
    //     console.log('dashboard go to /login');
    //     props.history.push('/login');
    // }

    return (
        <div className="container">
            {/* <h2>Welcome {user.name}!</h2> */}

            <div className="row mt-5">
                <div className="col-sm-6">
                    <h3>Enviar mensaje</h3>
                    <hr />
                    <input type="text" id='txtUid' className="form-control mb-2" placeholder="uid" autoComplete="off" />
                    <input type="text" id='txtMensaje' className="form-control mb-2" placeholder="Mensaje" autoComplete="off" />

                    <Users usuarios={usuariosActivos} />
                    {/* <h3>Usuarios</h3>
                    <hr />
                    <ul id="ulUsuarios">
                        {
                        usuariosActivos.map((user, index) => {
                            return <li key={index}>{user.name}</li>
                        })}
                    </ul> */}
                </div>

                <div className="col-sm-6">
                    <h3>Chat completo</h3>
                    <hr />
                    <ul id="ulMensajes">

                    </ul>
                </div>

                <div className="col-sm-6">
                    <h3>Chat privado</h3>
                    <hr />
                    <ul id="ulMensajesPrivados">

                    </ul>
                </div>
            </div>

            <input type="button" value="Logout"  />
        </div>
    );
}

export default Dashboard;