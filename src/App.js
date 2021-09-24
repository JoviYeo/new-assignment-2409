import './App.css';
import Login from './Login/Login';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Transfer from './Transfer/Transfer';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

function getToken() {
  return localStorage.getItem('token');
}

function App() {

  const [token, setToken] = useState(getToken());

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/Dashboard' />} />
          <Route path="/Dashboard" component={Dashboard}>
            <Dashboard setToken={setToken} />
          </Route>
          <Route path="/Transfer" component={Transfer}>
            <Transfer />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
