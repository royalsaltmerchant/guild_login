import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import {registerUser as registerUserAPICall} from '../config/api'

export default function Register() {
  const [warningTextUsername, setWarningTextUsername] = useState('')
  const [warningTextPassword, setWarningTextPassword] = useState('')
  const [warningUsernameToggle, setWarningUsernameToggle] = useState(false)
  const [warningPasswordToggle, setWarningPasswordToggle] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertType, setAlertType] = useState('warning')
  const [alertText, setAlertText] = useState('Something went wrong, please try again later!')
  const history = useHistory()

  useEffect(() => {
      if(alert) {
        setTimeout(() => {
          setAlert(false)
        }, 5000)
      }
  });

  function renderAlert() {
    if(alert) {
      return(
        <Alert variant={alertType}>
          {alertText}
        </Alert>
      )
    }
  }

  function renderWarningTextUsername() {
    if(warningUsernameToggle === true) {
      return(
        <Form.Text style={{color: 'red'}}>
          {warningTextUsername}
        </Form.Text>
      )
    }
  }

  function renderWarningTextPassword() {
    if(warningPasswordToggle === true) {
      return(
        <Form.Text style={{color: 'red'}}>
          {warningTextPassword}
        </Form.Text>
      )
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const username = event.target.username.value.trim()
    const email = event.target.email.value.trim()
    const password = event.target.password.value.trim()
    const firstName = event.target.firstName.value.trim()
    const lastName = event.target.lastName.value.trim()
    const params = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    }
    if(!warningPasswordToggle && !warningUsernameToggle) {
      try {
        const res = await registerUserAPICall(params)
        if(res.status === 201) {
          history.push("/login")
        }
      } catch (error) {
        console.log(error.response)
        if(error.response.status === 400) {
          setAlert(true)
          setAlertType('warning')
          setAlertText('Email or Username is already in use')
        } else {
          setAlert(true)
          setAlertType('danger')
          setAlertText('Something went wrong, please try again later!')
        }
      }
    } else {
      setAlert(true)
      setAlertText('Please Fix Errors Before You Register!')
    }

  }

  function handleUsername(event) {
    const username = event.target.value
    if(username.length >= 20) {
      setWarningUsernameToggle(true)
      setWarningTextUsername('Too Long!')
    } else {
      setWarningUsernameToggle(false)
    }
  }

  function handlePassword(event) {
    const password = event.target.value
    if(password.length > 20) {
      setWarningPasswordToggle(true)
      setWarningTextPassword('Too Long!')
    } else if(password.length < 8 && password.length >= 1) {
      setWarningPasswordToggle(true)
      setWarningTextPassword('Too Short!')
    } else {
      setWarningPasswordToggle(false)
    }
  }

  return (
    <div>
      {renderAlert()}
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form.Group controlId="username">
            <Form.Control 
              required
              style={{maxWidth: '400px'}}
              onChange={(event) => handleUsername(event)}
              size="md" 
              type="text" 
              placeholder="Username" />
            {renderWarningTextUsername()}
            <Form.Text id="passwordHelpBlock" muted>
                Your username must be shorter than 20 characters.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Control 
              required
              style={{maxWidth: '400px'}}
              size="md"
              type="email"
              placeholder="Email Address" />
            <Form.Text className="text-muted">
              We'll never share your info with anyone else.
            </Form.Text>
          </Form.Group>
          <div className="d-flex flex-row flex-wrap">
            <Form.Group controlId="firstName">
              <Form.Control 
                required
                size="md"
                type="text"
                placeholder="First Name" />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Control 
                required
                size="md"
                type="text"
                placeholder="Last Name" />
            </Form.Group>
          </div>

          <Form.Group controlId="password">
            <Form.Control 
              required
              style={{maxWidth: '400px'}}
              onChange={(event) => handlePassword(event)}
              size="md" 
              type="password" 
              placeholder="Password" 
              aria-describedby="passwordHelpBlock" />
            {renderWarningTextPassword()}
            <Form.Text id="passwordHelpBlock" muted>
              Your password must be 8-20 characters long.
            </Form.Text>
          </Form.Group>

          <p>Please read and agree to our <a href='http://sfaudioguild.com/user-license-agreement.pdf' target="_blank" rel="noopener noreferrer">USER LICENSE AGREEMENT</a> before completing registration</p>

          <Form.Group controlId="userAgreement">
            <Form.Check required type="checkbox" label="I agree to the USER LICENSE AGREEMENT" />
          </Form.Group>

          <Button variant="outline-secondary" type="submit">
            Register
          </Button>
        </Form>
        <br />
        <div className="d-flex flex-column">
          <small>Aready a Member?</small>
          <Link to="/login">Log In!</Link>
        </div>
    </div>
  )
}