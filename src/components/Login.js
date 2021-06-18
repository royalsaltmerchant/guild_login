import React, { Component } from 'react'
import {Form, Button} from 'react-bootstrap'

export default class Login extends Component {

  handleSubmit(event) {
    console.log(event)
  }

  render() {
    return (
      <div className=" w-50">
        <h2 className="text-center">Login</h2>
        <Form onSubmit={(event) => this.UNSAFE_componentWillMounthandleSubmit(event)}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              required
              size="md"
              type="email"
              placeholder="Account Email" />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="password" 
              placeholder="Account Password" />
          </Form.Group>
            <Button variant="outline-dark" type="submit">
              Login
            </Button>
        </Form>
      </div>
    )
  }
}
