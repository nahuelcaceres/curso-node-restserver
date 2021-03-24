import React from 'react';

const Users = ({usuarios}) => {
    return (
        <div >
            <h3>Usuarios</h3>
            <hr />
            <ul id="ulUsuarios">
                {
                    usuarios.map((user, index) => {
                        return <li key={index}>{user.name}</li>
                    })}
            </ul>
        </div>

    );
}

export default Users;