import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

export default class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    const email = event.target.email.value.trim()
    console.log(email)
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
          <Button variant="outline-success" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}
