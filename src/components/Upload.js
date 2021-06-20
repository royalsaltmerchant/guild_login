import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

export default class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleSubmit() {

  }

  render() {
    return (
      <div>
        <div className="p-1 rounded border border-dark" style={{width: '60vw', height: '25vh', backgroundColor: '#fff', overflow: 'scroll'}}>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
          <p>test item blah blah blah blah</p>
        </div>
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="file">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="file" 
              multiple
            />
          </Form.Group>
            <Button variant="outline-dark" type="submit">
              Upload
            </Button>
        </Form>    
      </div>
    )
  }
}
