import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import {Provider as MobxStoreProvider} from 'mobx-react';
import mobxStoresToInject from './mobx'
import Register from './components/Register'
import Login from './components/Login'
import Logout from './components/Logout'
import Account from './components/Account'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard';
import Upload from './components/Upload'
import Library from './components/Library';
import PackDetails from './components/PackDetails';
import AccessDenied from './components/AccessDenied';
import NoMatch from './components/NoMatch';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap'
import {authenticate as authenticateAPICall} from './config/api'


const mobxStores = {
  ...mobxStoresToInject
}

class Root extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      authorized: false
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token')
    if(token) {
      try {
        const res = await authenticateAPICall()
        if(res.status === 200) {
          this.setState({
            authorized: true
          })
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({
        authorized: false
      })
    }
  } 

  render(){
    return <Container fluid className="App">
      <Header />
      <NavBar authorized={this.state.authorized} />
      <div className="d-flex justify-content-center p-3 rounded border border-light" style={{backgroundColor: '#f6f6f6'}}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/library">
            <Library />
          </Route>
          <Route path="/pack/:packName">
            <PackDetails />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            {!this.state.authorized? <Login /> : <div><h2 className="text-center">Login</h2><p> already logged in</p> </div>}
          </Route>
          <Route path="/account">
            {this.state.authorized? <Account /> : <AccessDenied />}
          </Route>
          <Route path="/Dashboard">
            {this.state.authorized? <Dashboard /> : <AccessDenied />}
          </Route>
          <Route path="/Upload/entry/:entryId">
            {this.state.authorized? <Upload /> : <AccessDenied />}
          </Route>
          <Route render={() => <NoMatch />}/>
        </Switch>
      </div>
    </Container>
  }
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
