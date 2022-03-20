import React, { Component } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { requestResetEmail as requestResetEmailAPICall } from '../config/api'

export default class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      alert: false,
      alertType: 'warning',
      alertText: 'Something went wrong, please try again.'
    }
  }

  componentDidUpdate() {
    if(this.state.alert) {
      setTimeout(() => {
        this.setState({
          alert: false
        })
      }, 10000)
    }
  }

  renderAlert() {
    if(this.state.alert) {
      return(
        <Alert variant={this.state.alertType}>
          {this.state.alertText}
        </Alert>
      )
    }
  }

  async handleSubmit(event) {
    event.preventDefault()
    const email = event.target.email.value.trim()
    try {
      const res = await requestResetEmailAPICall(email)
      if(res.status === 200) {
        this.setState({
          alert: true,
          alertText: "Sent! Please check your email for instruction.",
          alertType: "success"
        })
      }
    } catch(err) {
      if(err.response && err.response.status === 400) {
        this.setState({
          alert: true,
          alertText: "No user found with this email.",
          alertType: "warning"
        })
      } else {
        this.setState({
          alert: true,
          alertText: "Something went wrong, please try again.",
          alertType: "danger"
        })
      }
    }
  }
  render() {
    return (
      <div>
        {this.renderAlert()}
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="email">
            <Form.Control 
              required
              style={{maxWidth: '400px'}}
              size="md"
              type="text"
              placeholder="Email" />
          </Form.Group>
          <Button variant="outline-secondary" type="submit">
            Send Reset Password Link
          </Button>
        </Form>
      </div>
    )
  }
}
