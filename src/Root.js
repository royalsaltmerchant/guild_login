import React from 'react'
import './App.css';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Register from './views/Register'
import Login from './views/Login'
import Logout from './views/Logout'
import Account from './views/Account'
import Header from './views/Header'
import NavBar from './views/NavBar'
import Dashboard from './views/Dashboard';
import Upload from './views/Upload'
import Library from './views/Library';
import PackDetails from './views/PackDetails';
import AccessDenied from './views/AccessDenied';
import NoMatch from './views/NoMatch';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap'
import {authenticate as authenticateAPICall} from './config/api'
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import ManageContribution from './views/ManageContribution';

class Root extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loadingAuth: true
    }
  }
  
  componentDidMount() {
    // authenticate
    this.authenticate()
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
        } else throw new Error
      } catch(err) {
        this.setState({
          authenticated: false,
          loadingAuth: false
        })
      }
    }
    else {
      this.setState({
        authenticated: false,
        loadingAuth: false
      })
    } 
  }
  

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
            <Logout isLoading={() => this.setState({loadingAuth: true})} authenticate={this.authenticate} />
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
            <Account/>
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
          <Route path="/Manage/:id">
            <ManageContribution />
          </Route>
          <Route render={() => <NoMatch />}/>
        </Switch>
      </div>
    </Container>
  }
}

export default Root