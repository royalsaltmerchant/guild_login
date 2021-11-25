import React, { Component } from 'react'
import {
  Link
} from "react-router-dom";

export default class NavBar extends Component {

  render() {
    const {authenticated} = this.props
    return(
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="w-75 d-flex justify-content-around nav-button">
          {authenticated && <Link to="/account">Account</Link>}
          {authenticated && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/library">Library</Link>
          {authenticated ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
        <hr style={{width: '75%'}}/>
      </div>
    )
  }
}
