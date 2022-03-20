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
import Profile from './views/Profile';
import Upgrade from './views/Upgrade';
import RegisterContributor from './views/RegisterContributor';

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

  renderSideBar() {
    const {authenticated} = this.state

    if(this.state.hideSideBar) {
      return(
        <div 
          className="d-flex flex-column sticky-top"
          style={{height: '40px'}}
        >
          <button className="hide-btn m-0" onClick={() => this.setState({hideSideBar: false})}>
            <BiShow style={{fontSize: '30px'}} />
          </button>
        </div>
      )
    } else {
      return(
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
            <BiHide style={{fontSize: '30px'}}/>
          </button>
        </div>
      )
    }
  }
  

  render(){
    const {authenticated, loadingAuth} = this.state
    return(
      <div className="App d-flex flex-row h-100">
        {this.renderSideBar()}
        <div className="container-fluid mt-3 h-100">
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
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/register-contributor">
              <RegisterContributor />
            </Route>
            <Route path="/login">
              <Login authenticate={this.authenticate} authenticated={authenticated} loadingAuth={loadingAuth} />
            </Route>
            <Route path="/account">
              <Account/>
            </Route>
            <Route path="/profile/:username">
              <Profile/>
            </Route>
            <Route path="/Dashboard">
              <Dashboard /> 
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
            <Route path="/upgrade/">
              {authenticated ? <Upgrade /> : <AccessDenied loadingAuth={loadingAuth}/>}
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