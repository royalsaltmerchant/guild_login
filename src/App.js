import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
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
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


const mobxStores = {
  ...mobxStoresToInject
}

class Root extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loadingAuth: true
    }
  }

  authenticate = async () => {
    const token = localStorage.getItem('token')
    if(token) {
      try {
        const res = await authenticateAPICall()
        if(res.status === 200) {
          this.setState({
            authenticated: true,
            loadingAuth: false
          })
        } else {
          this.setState({
            authenticated: false,
            loadingAuth: false
          })      
        }
      } catch(err) {
        this.setState({
          authenticated: false,
          loadingAuth: false
        })
        console.log(err)
      }
    }
    else {
      this.setState({
        authenticated: false,
        loadingAuth: false
      })
    } 
  }
  
  componentDidMount() {this.authenticate()} 

  render(){
    const {authenticated, loadingAuth} = this.state
    return <Container fluid className="App">
      <Header />
      <NavBar authenticated={authenticated} />
      <div className="d-flex justify-content-center p-3 rounded border border-light" style={{backgroundColor: '#f6f6f6'}}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/logout">
            <Logout isLoading={() => this.setState({loadingAuth: true})} />
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
            <Login isLoading={() => this.setState({loadingAuth: true})} authenticate={this.authenticate} authenticated={authenticated} loadingAuth={loadingAuth} />
          </Route>
          <Route path="/account">
            <Account authenticate={this.authenticate} authenticated={authenticated} loadingAuth={loadingAuth} />
          </Route>
          <Route path="/Dashboard">
            {authenticated ? <Dashboard /> : <AccessDenied />}
          </Route>
          <Route path="/Upload/entry/:entryId">
            {authenticated ? <Upload /> : <AccessDenied />}
          </Route>
          <Route path="/forgot_password">
            <ForgotPassword />
          </Route>
          <Route path="/reset_password/:token">
            <ResetPassword />
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
