import React, { Component } from 'react'
import {authenticate as authenticateAPICall} from '../config/api'

export default class Account extends Component {
  constructor() {
    super()
    this.state = {
      authenticated: false,
      loading: true
    }
  }

  componentDidMount() {
    this.authenticate()
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
    const {loading, authenticated} = this.state
    if(!loading, authenticated) {
      return(
        <p>yes</p>
      )
    }
    if(loading) {
      return(
        <p>loading</p>
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
      <div>
        <h2 className="text-center">Account</h2>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}
