import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import {
  NavLink
} from "react-router-dom";

class NavBar extends Component {

  componentDidMount() {
    this.props.userStore.getUserInfo()
  }

  renderAdminToolsLink() {
    const {authenticated, userStore} = this.props
    if(userStore.userInfo && userStore.userInfo.admin && authenticated) {
      return(
        <NavLink className="d-flex flex-row align-items-center nav-link" to="/admin/tools">Admin Tools</NavLink>
      )
    }
  }

  render() {
    const {authenticated} = this.props
    return(
      <div className="nav-button d-flex flex-column">
        <hr className="w-75 m-0 p-0 align-self-center"/>
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/account">Account</NavLink>}
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/dashboard">Dashboard</NavLink>}
        <NavLink className="d-flex flex-row align-items-center nav-link" to="/library">Library</NavLink>
        {this.renderAdminToolsLink()}
        {authenticated ? 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/logout">Logout</NavLink> : 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/login">Login</NavLink>}
      </div>
    )
  }
}

export default inject('userStore')(observer(NavBar))
