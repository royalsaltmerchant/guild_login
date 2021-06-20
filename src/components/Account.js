import React, { Component } from 'react'
import {authenticate as authenticateAPICall} from '../config/api'
import {inject, observer} from 'mobx-react'
import {Spinner} from 'react-bootstrap'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loading: true,
      hasUserInfo: false
    }
  }

  componentDidMount() {
    this.authenticate()
  }

  async componentDidUpdate() {
    const {authenticated, hasUserInfo} = this.state
    if(authenticated && !hasUserInfo) {
      try {
        const res = await this.props.userStore.getUserInfo()
        if(res.status === 200) {
          this.setState({hasUserInfo: true})
        }
      } catch(err) {
        console.log(err)
      }
    }
  }

  async authenticate() {
    try {
      const res = await authenticateAPICall()
      if(res.status === 200) {
        this.setState({
          authenticated: true,
          loading: false
        })
      }
    } catch(err) {
      if(err.response.stats === 400) {
        console.log('invalid or expired token')
      }
      console.log(err)
      this.setState({
        loading: false
      })
    }
  }

  renderAdminTools() {
    return(
      <p>admin tools</p>
    )
  }

  renderLoadingOrAccount() {
    const {loading, authenticated, hasUserInfo} = this.state
    if(!loading && authenticated && hasUserInfo) {
      const {userInfo} = this.props.userStore
      return(
        <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', height: '50vh', backgroundColor: '#fff'}}>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
          {userInfo.admin ? this.renderAdminTools() : null}
        </div>
      )
    }
    if(loading) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', height: '50vh', backgroundColor: '#fff'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }
    if(!loading && !authenticated) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', height: '50vh', backgroundColor: '#fff'}}>
          <p>Can't find user data...</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h2 className="m-100 text-center">Account</h2>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}

export default inject('userStore')(observer(Account));
