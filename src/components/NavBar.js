import React, { Component } from 'react'
import {
  NavLink
} from "react-router-dom";

export default class NavBar extends Component {

  render() {
    const {authenticated} = this.props
    return(
      <div className="nav-button d-flex flex-column">
        <hr className="w-75 m-0 p-0 align-self-center"/>
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/account">Account</NavLink>}
        {authenticated && <NavLink className="d-flex flex-row align-items-center nav-link" to="/dashboard">Dashboard</NavLink>}
        <NavLink className="d-flex flex-row align-items-center nav-link" to="/library">Library</NavLink>
        {authenticated ? 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/logout">Logout</NavLink> : 
          <NavLink className="d-flex flex-row align-items-center nav-link" to="/login">Login</NavLink>}
      </div>
    )
  }
}
