import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap'

export default class AccessDenied extends Component {
  render() {
    if(this.props.loadingAuth) {
      return(
        <Spinner animation="border" role="status" />
      )
    } else {
      return (
        <div>
          <h1>Access Denied</h1>
        </div>
      )
    }
  }
}
