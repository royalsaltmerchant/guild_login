import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Provider as MobxStoreProvider} from 'mobx-react';
import mobxStoresToInject from './mobx'
import Login from './components/Login'
import Logout from './components/Logout'
import Account from './components/Account'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard';
import Upload from './components/Upload'
import Library from './components/Library';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap'

const mobxStores = {
  ...mobxStoresToInject
}

function Root() {
  return(
    <Container fluid className="App">
      <Header />
      <NavBar />
      <div className="d-flex justify-content-center p-3 rounded border border-light" style={{backgroundColor: '#f6f6f6'}}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/library">
            <Library />
          </Route>
          <Route path="/Upload/entry/:entryId">
            <Upload />
          </Route>
        </Switch>
      </div>
    </Container>
  )
}

function App() {
  return (
    <MobxStoreProvider {...mobxStores}>
      <Router>
        <Root />
      </Router>
    </MobxStoreProvider>
  );
}

export default App;
