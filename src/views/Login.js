import React, { Component } from 'react'
import {Form, Button, Alert} from 'react-bootstrap'
import {login as loginAPICall} from '../config/api'
import {withRouter, Link} from 'react-router-dom';
import {authenticate as authenticateAPICall} from '../config/api'
import { Spinner } from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props)
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
    if(this.props.authenticated) {
      this.props.history.push('/account')
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
    const username_or_email = event.target.username_or_email.value.trim()
    const password = event.target.password.value.trim()
    const params = {
      username_or_email: username_or_email,
      password: password
    }
    try {
      const res = await loginAPICall(params)
      if(res.status === 200) {
        this.props.isLoading()
        const token = res.data.token
        localStorage.setItem('token', "Bearer " + token)
        this.props.history.push('/account')
        this.props.authenticate()
      }
    } catch(err) {
      if(err.response && err.response.status === 400) {
        this.setState({
          alert: true,
          alertText: "Invalid Username/Email or Password.",
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

  renderLogin(){
    const {authenticated, loadingAuth} = this.props
    if(loadingAuth){
      return(
        <div>
          <h2 className="pb-3 text-center">Login</h2>
          <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </div>
      )
    } else {
      if(!authenticated){
        return(
          <div className="w-50">
            {this.renderAlert()}
            <h2 className="pb-3 text-center">Login</h2>
            <div>
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
                    placeholder="Password"
                  />
                  <Link to="/forgot_password"><small>Forgot Password?</small></Link>
                </Form.Group>
                <Button variant="outline-success" type="submit">
                  Login
                </Button>
              </Form>
              <br />
              <div className="d-flex flex-column">
                <small>Need an Account?</small>
                <Link to="/register">Join Us!</Link>
              </div>
            </div>
          </div>
        )
      }
      else {
        return(
          <div>
            <h2 className="pb-3 text-center">Login</h2>
            <p className="text-center"> already logged in</p>
          </div>
        )
      }
    }
  }

  render() {
    return this.renderLogin()
  }
}

export default withRouter(Login)