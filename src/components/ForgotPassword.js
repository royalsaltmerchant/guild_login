import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

export default class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      email: ''
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(event)
  }
  render() {
    return (
      <div className="w-50">
        <h2 className="pb-3 text-center">Forgot Password</h2>
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="email">
            <Form.Label>Enter your email to receive password reset link</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Email" />
          </Form.Group>
        </Form>
      </div>
    )
  }
}
