import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [room, setRoom] = useState('')

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Room" onChange={(event) => setRoom(event.target.value)} className="joinInput mt-20" type="text" /></div>
                <Link onClick={(ev) => (!room) ? ev.preventDefault() : null} to={`/chat?room=${room}`}>
                    <button className="button mt-20" type="submit">Go</button>
                </Link>
            </div>
        </div>
    );
}

export default Join;