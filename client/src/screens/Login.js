import React, { useState } from 'react';
import { setUserSession } from '../utils/Common';

const Login = (props) => {

    const [email, setEmail] = useState('test1@gmail.com')
    const [password, setPassword] = useState('123456')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleRegister = () => {

    }

    const handleLogin = () => {
        if (email === '' || password === '') {
            setError('Completar campos')
            return
        }

        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEmail.test(email)) {
            setError('Invalid Email Address')
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
                setError('Something went wrong. Please try again later.')
            });
    }

    return (
        <div className="container">
            <h2 className='text-center'>Login</h2>
            <form>
                <div className="mb-3">

                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email" className='form-control' />

                </div>

                <div className="mb-3">
                    <input value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyPress={event => event.key === 'Enter' ? handleLogin() : null}
                        type="password"
                        placeholder="password"
                        className='form-control' />
                </div>

                {error && <div className='error'>{error}</div>}

                <input
                    className="btn btn-primary"
                    type="button"
                    value={loading ? "Loading..." : "Login"}
                    disabled={loading}
                    onClick={handleLogin}
                />

                <input
                    className='btn btn-secondary registerButton'
                    type="button"
                    value={loading ? "Loading..." : "Register"}
                    disabled={loading}
                    onClick={handleRegister}
                />

            </form>

        </div>
    );
}

export default Login;