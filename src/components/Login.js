import React, { Component } from 'react'
import {Form, Button} from 'react-bootstrap'
import {login as loginAPICall} from '../config/api'
import {withRouter} from 'react-router-dom';

class Login extends Component {

  async handleSubmit(event) {
    event.preventDefault()
    const username_or_email = event.target.username_or_email.value.trim()
    const password = event.target.password.value

    try {
      const res = await loginAPICall(username_or_email, password)
      if(res.status === 200) {
        const token = res.data.token
        localStorage.setItem('token', "Bearer " + token)
        this.props.history.push('/account')
        this.props.history.go()
      }
    } catch(err) {
      console.log(err)
      if(err.response) {
        console.log('error status', err.response.status)
      }
      else {
        console.log('something went wrong')
      }
    }
  }

  render() {
    return (
      <div className="w-50">
        <h2 className="text-center">Login</h2>
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="username_or_email">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Username or Email" />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="password" 
              placeholder="Password" />
          </Form.Group>
            <Button variant="outline-success" type="submit">
              Login
            </Button>
        </Form>
      </div>
    )
  }
}

export default withRouter(Login)