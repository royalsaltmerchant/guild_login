import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Provider as MobxStoreProvider} from 'mobx-react';
import Login from './components/Login'

const mobxStores = {
  ...mobxStoresToInject
}

function Root() {
  return(
    <div>

      <Switch>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </div>
  )
}

function App() {
  return (
    <MobxStoreProvider {...mobxStores}>
      <Router>
        <Root {...this.props} />
      </Router>
    </MobxStoreProvider>
  );
}

export default App;
