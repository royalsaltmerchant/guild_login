import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { editUser } from '../config/api';

const RegisterContributor = inject('userStore')(observer((props) => {
  const [done, setDone] = useState(false)
  const [alert, setAlert] = useState(false)
  const [phone, setPhone] = useState('')
  const [alertType, setAlertType] = useState('warning')
  const [alertText, setAlertText] = useState('Something went wrong, please try again later!')

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


  async function handleSubmit(event) {
    event.preventDefault()

    const address = event.target.address.value.trim()
    const city = event.target.city.value.trim()
    const state = event.target.state.value.trim()
    const phone = event.target.phone.value.trim()

    const params = {
      user_id: props.userStore.userInfo.id,
      address: `${address}, ${city}, ${state}`,
      phone: phone
    }

    try {
      const res = await editUser(params)
      if(res.status === 200) {
        setDone(true)
      }
    } catch (error) {
      console.log(error.response)
      setAlert(true)
      setAlertType('danger')
      setAlertText('Something went wrong, please try again later!')
    }

  }

  if(done) {
    return(
      <div>
        <h2>Success!</h2>
        <p>Thanks for applying to be a contributor! We will review your application and update your account soon.</p>
      </div>
    )
  } else return (
    <div>
      {renderAlert()}
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form.Group controlId="address">
            <Form.Control 
              required
              style={{maxWidth: '400px'}}
              size="md"
              type="address"
              placeholder="Physical Address" />
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Control 
              required
              style={{maxWidth: '200px'}}
              size="md"
              type="city"
              placeholder="City" />
          </Form.Group>

          <Form.Group controlId="state">
            <Form.Control 
              required
              style={{maxWidth: '200px'}}
              size="md"
              type="state"
              placeholder="State" />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Control 
              required
              style={{maxWidth: '200px'}}
              size="md"
              type="tel"
              placeholder="Phone: 555-555-5555" 
              value={phone}
              onChange={(e) => {
                if (e.target.value.length < 13) {
                  var cleaned = ("" + e.target.value).replace(/\D/g, "");

                  let normValue = `${cleaned.substring(0, 3)}${
                    cleaned.length > 3 ? "-" : ""
                  }${cleaned.substring(3, 6)}${
                    cleaned.length > 6 ? "-" : ""
                  }${cleaned.substring(6, 11)}`;

                  setPhone(normValue);
                }
              }}
            />
          </Form.Group>

          <p>Please read and agree to our <a href='http://sfaudioguild.com/contributor-license-agreement.pdf' target="_blank" rel="noopener noreferrer">CONTRIBUTOR LICENSE AGREEMENT</a> before applying</p>

          <Form.Group controlId="userAgreement">
            <Form.Check required type="checkbox" label="I agree to the CONTRIBUTOR LICENSE AGREEMENT" />
          </Form.Group>

          <p>Please download and email a signed copy of our <a href='http://sfaudioguild.com/copyright-license-agreement.pdf' target="_blank" rel="noopener noreferrer">COPYRIGHT LICENSE AGREEMENT</a> to <a href='mailto:admin@sfaudioguild.com'>admin@sfaudioguild.com</a></p>
          
          <Form.Group controlId="copyrightSigned">
            <Form.Check required type="checkbox" label="I have emailed a signed copy of the COPYRIGHT LICENSE AGREEMENT" />
          </Form.Group>

          <Button variant="outline-secondary" type="submit">
            Apply for Contributor
          </Button>
        </Form>
    </div>
  )
}))

export default RegisterContributor
