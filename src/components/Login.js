import React, { Component } from 'react'
import {Form, Button} from 'react-bootstrap'
import {login as loginAPICall} from '../config/api'

export default class Login extends Component {

  async handleSubmit(event) {
    event.preventDefault()
    const email = event.target.email.value.trim()
    const password = event.target.password.value

    try {
      const res = await loginAPICall(email, password)
      if(res.status === 200) {
        const token = res.data.token
        localStorage.setItem('token', "Bearer " + token)
      }
    } catch(err) {
      if(err.response.status === 400) {
        console.log('wrong data')
      }
      else {
        console.log('something went wrong')
      }
    }
  }

  render() {
    return (
      <div className=" w-50">
        <h2 className="text-center">Login</h2>
        <Form onSubmit={(event) => this.handleSubmit(event)}>
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
