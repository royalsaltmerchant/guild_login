import { inject, observer } from 'mobx-react';
import React, { Component } from 'react'
import {
  Link
} from "react-router-dom";
import { Button } from 'react-bootstrap';
import {BiCoin} from 'react-icons/bi'

class NavBar extends Component {

  componentDidMount() {
    this.props.userStore.getUserInfo()
  }

  renderAdminToolsLink() {
    const {authenticated, userStore} = this.props
    if(userStore.userInfo && userStore.userInfo.admin && authenticated) {
      return(
        <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/admin/tools">Admin Tools</Button>
      )
    }
  }

  renderBuyCoins() {
    const {authenticated, userStore} = this.props
    if(userStore.userInfo && authenticated) {
      return(
        <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/coins">Buy <BiCoin className="ml-1" style={{fontSize: '25px', color: 'orange'}} /><p style={{fontSize: '10px', color: 'green'}}>{userStore.userInfo.coins}</p></Button>
      )
    }
  }

  render() {
    const {authenticated} = this.props
    return(
      <div className="nav-button d-flex flex-column">
        <hr className="w-75 m-0 p-0 align-self-center"/>
        {this.renderAdminToolsLink()}
        {authenticated && <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/account">Account</Button>}
        <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/library">Library</Button>
        <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/dashboard">Contribute</Button>
        {this.renderBuyCoins()}
        {authenticated ? 
          <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/logout">Logout</Button> : 
          <Button variant="link" as={Link} className="d-flex flex-row align-items-center nav-link" to="/login">Login</Button>}
      </div>
    )
  }
}

export default inject('userStore')(observer(NavBar))
