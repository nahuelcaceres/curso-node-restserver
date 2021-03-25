import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import queryString from 'query-string';

import InfoBar from "../../components/InfoBar/InfoBar";
import Input from "../../components/Input/Input";
import Messages from "../../components/Messages/Messages";

import { getToken, getUser, removeUserSession } from '../../utils/Common';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([]);
    const user = getUser();
    const { room } = queryString.parse(location.search);
    const ENDPOINT = 'https://chat-nmc.herokuapp.com/';

    useEffect(() => {
        console.log(ENDPOINT);
        socket = io(ENDPOINT, {
            transports: ['websocket', 'hola viejo'],
            auth: { "x-token": getToken(), data: { uid: user.uid, room: room } },
        })

        //---- CLEAN UP THE EFFECT
        return (() => {
            removeUserSession();
            socket.emit('disconnect_');

            socket.off();
        });
        //-------------------------------

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        setTimeout(() => {
            socket.emit('join', { uid: user.uid, room }, (error) => {
                if (error) {
                    alert(error);
                }
            })
        }, 1000);

    }, []);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

    }, [messages]);


    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={user.name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default Chat;