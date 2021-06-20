import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'

export default class CreateProject extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className="p-3">
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Project Name" />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              required
              size="md"
              type="text"
              placeholder="Project Description" />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              size="md" 
              type="file"
              accept="image/*" 
             />
          </Form.Group>
            <Button variant="outline-success" type="submit">
              Create
            </Button>
        </Form>
      </div>
    )
  }
}
