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
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap'

const mobxStores = {
  ...mobxStoresToInject
}

function Root() {
  return(
    <Container fluid className="App">
      <Header />
      <div className="d-flex justify-content-center mx-5 p-3 rounded border border-light" style={{height: 600, backgroundColor: '#f6f6f6'}}>
        <Switch>
          <Route path="/">
            <Login />
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
