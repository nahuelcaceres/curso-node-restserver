import React, { useEffect, useState } from 'react';

import './Join.css';

const Join = (props) => {
    const [room, setRoom] = useState('')
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        fetch('api/users/rooms')
            .then((res) => (res.json()))
            .then(data => setRooms(data.rooms))
    }, []);

    const handleJoin = () => {

        props.history.push(`/chat?room=${room}`);
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Choose a room</h1>

                {
                    rooms.length > 0 &&
                    <div className='roomSelect' >
                        <select className="form-select"  onChange={(event) => setRoom(event.target.value)} aria-label="Default select example">
                            {rooms.map((room) => <option value={room} key={room}>{room}</option>)}
                        </select>
                        <button className='btn btn-secondary' onClick={handleJoin()}>Go</button>
                    </div>
                }

                <div>
                    <input
                        placeholder="Create one"
                        onChange={(event) => setRoom(event.target.value)}
                        onKeyPress={(event) => event.key === 'Enter' ? handleJoin() : null}
                        className="joinInput mt-20" type="text" />
                </div>

            </div>
        </div>
    );
}

export default Join;