import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import {
  NavLink
} from "react-router-dom";
import {BiCoin} from 'react-icons/bi'

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

  renderBuyCoins() {
    const {authenticated, userStore} = this.props
    if(userStore.userInfo && authenticated) {
      return(
        <NavLink className="d-flex flex-row align-items-center nav-link" to="/buy-coins">Buy <BiCoin className="ml-1" style={{fontSize: '25px', color: 'orange'}} /><p style={{fontSize: '10px', color: 'green'}}>{userStore.userInfo.coins}</p></NavLink>
      )
    }
  }

  render() {
    const {authenticated} = this.props
    return(
      <div className="nav-button d-flex flex-column">
        <hr className="w-75 m-0 p-0 align-self-center"/>
        {this.renderAdminToolsLink()}
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/account">Account</NavLink>}
        <NavLink className="d-flex flex-row align-items-center nav-link" to="/library">Library</NavLink>
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/dashboard">Contribute</NavLink>}
        {this.renderBuyCoins()}
        {authenticated ? 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/logout">Logout</NavLink> : 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/login">Login</NavLink>}
      </div>
    )
  }
}

export default inject('userStore')(observer(NavBar))
