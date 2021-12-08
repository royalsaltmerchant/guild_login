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
import Header from './components/Header'
import NavBar from './components/NavBar'
import Dashboard from './views/Dashboard';
import Contribute from './views/Contribute'
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
import AdminTools from './views/AdminTools';
import {BiHide, BiShow} from 'react-icons/bi';

class Root extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loadingAuth: false,
      hideSideBar: false
    }
  }
  
  componentDidMount() {
    // authenticate
    this.authenticate()
  } 

  authenticate = () => {
    this.setState({
      loadingAuth: true
    }, async () => {
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
    })
  }
  

  render(){
    const {authenticated, loadingAuth} = this.state
    return(
      <div className="App d-flex flex-row" style={{height: '100%'}}>
        {
          this.state.hideSideBar 
          ?
          <div 
            className="d-flex flex-column sticky-top"
            style={{height: '40px'}}
          >
            <button className="hide-btn ml-2" onClick={() => this.setState({hideSideBar: false})}>
              <BiShow style={{fontSize: '40px'}} />
            </button>
          </div>
          :
          <div 
            className="d-flex flex-column sticky-top border rounded card-style" 
            style={{width: '170px', height: '100vh', backgroundColor: 'white'}}
          >
            <Header />
            <NavBar authenticated={authenticated} />
            <br />
            <button 
              className="hide-btn align-self-start ml-2"
              onClick={() => this.setState({hideSideBar: true})}
            >
              <BiHide style={{fontSize: '40px'}}/>
            </button>
          </div>
        }
        <div className="container-fluid" style={{height: '100%'}}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/logout">
              <Logout authenticate={this.authenticate} />
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
              <Login authenticate={this.authenticate} authenticated={authenticated} loadingAuth={loadingAuth} />
            </Route>
            <Route path="/account">
              <Account/>
            </Route>
            <Route path="/Dashboard">
              {authenticated ? <Dashboard /> : <AccessDenied loadingAuth={loadingAuth}/>}
            </Route>
            <Route path="/Contribute/entry/:entryId">
              {authenticated ? <Contribute /> : <AccessDenied loadingAuth={loadingAuth}/>}
            </Route>
            <Route path="/forgot_password">
              <ForgotPassword />
            </Route>
            <Route path="/reset_password/:token">
              <ResetPassword />
            </Route>
            <Route path="/Manage/:id">
            {authenticated ? <ManageContribution /> : <AccessDenied loadingAuth={loadingAuth}/>}
            </Route>
            <Route path="/admin/tools">
              {authenticated ? <AdminTools /> : <AccessDenied loadingAuth={loadingAuth}/>}
            </Route>
            <Route render={() => <NoMatch />}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default Root