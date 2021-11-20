import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logoutMessage: ''
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    if(token) {
      this.props.isLoading()
      localStorage.removeItem('token')
      this.props.history.push('/login')
      this.props.authenticate()
    } else {
      this.setState({
        logoutMessage: 'not logged in'
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Logout</h1>
        <p>{this.state.logoutMessage}</p>
      </div>
    )
  }
}

export default withRouter(Logout)
