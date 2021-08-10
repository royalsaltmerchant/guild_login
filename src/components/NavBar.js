import React, { Component } from 'react'
import {
  Link
} from "react-router-dom";

export default class NavBar extends Component {

  render() {
    return(
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="w-75 d-flex justify-content-around">
          {this.props.authorized && <Link to="/account">Account</Link>}
          {this.props.authorized && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/library">Library</Link>
          {this.props.authorized ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
        <hr style={{width: '75%'}}/>
      </div>
    )
  }
}
