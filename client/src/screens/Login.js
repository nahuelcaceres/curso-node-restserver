import React, { useState } from 'react';
import { setUserSession } from '../utils/Common';

const Login = (props) => {

    const [email, setEmail] = useState('test1@gmail.com')
    const [password, setPassword] = useState('123456')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = () => {
        if (email === '' || password === '') {
            setError('Completar campos')
            return
        }

        setLoading(true)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
            redirect: 'follow'
        };

        fetch("/api/auth/login", requestOptions)
            .then((res) => (res.json()))
            .then((data) => {

                if (data.errors) {
                    setError(data.errors[0].msg)
                    setLoading(false)
                    return
                }

                if (data.msg) {
                    setError(data.msg)
                    setLoading(false)
                    return
                }

                //TODO: no pasa nada si se guarda el id del usuario en sessionstorage?? es una buena practica?
                setUserSession(data.token, JSON.stringify(data.user))
                props.history.push('/join');

                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
                setError('Something went wrong. Please try again later.')
            });
    }

    return (
        <div>
            <h2>Login</h2>
            <div>
                <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="username" />
            </div>

            <br />
            <div>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" />
            </div>
            <br />

            {error && <div className='error'>{error}</div>}

            <input
                type="button"
                value={loading ? "Loading..." : "Login"}
                disabled={loading}
                onClick={handleLogin}
            />

        </div>
    );
}

export default Login;