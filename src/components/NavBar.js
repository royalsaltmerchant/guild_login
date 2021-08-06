import React, { Component } from 'react'
import {
  Link
} from "react-router-dom";
import {authenticate as authenticateAPICall} from '../config/api'

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authorized: false
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token')
    if(token) {
      try {
        const res = await authenticateAPICall()
        if(res.status === 200) {
          this.setState({
            authorized: true
          })
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({
        authorized: false
      })
    }
  } 

  render() {
    return(
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="w-75 d-flex justify-content-around">
          {this.state.authorized ? <Link to="/account">Account</Link> : null}
          {this.state.authorized ? <Link to="/dashboard">Dashboard</Link> : null}
          <Link to="/library">Library</Link>
          {this.state.authorized ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
        <hr style={{width: '75%'}}/>
      </div>
    )
  }
}
