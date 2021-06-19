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

  renderLoadingOrAccount() {
    const {loading, authenticated, hasUserInfo} = this.state
    if(!loading && authenticated && hasUserInfo) {
      const {userInfo} = this.props.userStore
      return(
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )
    }
    if(loading) {
      return(
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )
    }
    if(!loading && !authenticated) {
      return(
        <p>no</p>
      )
    }
  }

  render() {
    return (
      <div className="m-100 text-center">
        <h2>Account</h2>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}

export default inject('userStore')(observer(Account));
