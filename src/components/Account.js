import React, { Component } from 'react'
import {authenticate as authenticateAPICall} from '../config/api'
import {inject, observer} from 'mobx-react'
import {Spinner, Button} from 'react-bootstrap'
import AdminTools from './AdminTools'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loading: true,
      hasUserInfo: false,
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
        <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
          <p style={{fontSize:"25px"}}>{userInfo.username}</p>
          <div className="px-3">
            <p>First Name: {userInfo.first_name}</p>
            <p>Last Name: {userInfo.last_name}</p>
            <p>Email: {userInfo.email}</p>
            <p>Eligible to access community files: {userInfo.eligible ? 'yes' : 'no'}</p>
            <p>Approved asset count: {userInfo.approved_asset_count}</p>
          </div>
          <br />
          {userInfo.admin ? <AdminTools /> : null}
        </div>
      )
    }
    if(loading) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }
    if(!loading && !authenticated) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
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
