import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link, NavLink } from 'react-router-dom'

import Dashboard from './screens/Dashboard';
import Home from './screens/Home';
import Login from './screens/Login';
import Join from './screens/Join/Join';
import { getToken, removeUserSession, setUserSession } from './utils/Common';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import Chat from './screens/Chat/Chat';

function App() {
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    console.log('Estoy por hacer el verifyToken contra la api');
    fetch(`/api/auth/verifyToken?token=${token}`)
      .then((res) => (res.json()))
      .then((data) => {

        setUserSession(data.token, data.user)
        setAuthLoading(false)
      })
      .catch((error) => {
        removeUserSession()
        setAuthLoading(false)
        console.log(error);
      });

  }, [])

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>

        <div className="header">
          <NavLink exact activeClassName="active" to="/">Home</NavLink>
          <NavLink activeClassName="active" to="/login">Login</NavLink>
          <NavLink activeClassName="active" to="/join">Join <small>Access with token</small></NavLink>
          <NavLink activeClassName="active" to="/dashboard">Dashboard <small>Access with token</small></NavLink>
        </div>

        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/join" component={Join} />
            <PrivateRoute exact path="/chat" component={Chat} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </div>

      </BrowserRouter>

    </div>

  );
}

export default App;
