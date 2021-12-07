import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";  
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { resetPassword as resetPasswordAPICall } from '../config/api';

export default function ResetPassword() {
  const [alert, setAlert] = useState(false)
  const [alertText, setAlertText] = useState('Something went wrong, please try again later!')
  const [alertType, setAlertType] = useState('warning')
  const {token} = useParams()

  useEffect(() => {
      if(alert) {
        setTimeout(() => {
          setAlert(false)
        }, 10000)
      }
  });

  async function handleSubmit(event) {
    event.preventDefault()
    const password = event.target.password.value

    try {
      const res = await resetPasswordAPICall(password, token)
      if(res.status === 200) {
        setAlert(true)
        setAlertType('success')
        setAlertText('Password Has Been Reset!')
      } else {
        setAlert(true)
        setAlertType('warning')
        setAlertText('Your request has expired or is invalid.')
      }
    } catch (error) {
      setAlert(true)
      setAlertType('danger')
      setAlertText('Something Went Wrong, Please Try Again Later.')
    }
    
  }

  function renderAlert() {
    if(alert) {
      return(
        <Alert variant={alertType}>
          {alertText}
        </Alert>
      )
    }
  }

  return (
    <div>
      {renderAlert()}
      <h2 className="pb-3 text-center">Reset Password</h2>
      <Form onSubmit={(event) => handleSubmit(event)}>
      <Form.Group controlId="password">
          <Form.Label>Enter your new password</Form.Label>
          <Form.Control 
            required
            size="md"
            type="password"
            placeholder="New Password" />
        </Form.Group>
        <Button variant="outline-success" type="submit">
          Reset
        </Button>
      </Form>
    </div>
  )
}
