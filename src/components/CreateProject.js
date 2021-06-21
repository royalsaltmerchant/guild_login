import { entries } from 'mobx'
import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'

export default class CreateProject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entries: [1],
    }
  }

  renderEntries() {
    const {entries} = this.state
    const elements = []
    entries.forEach(entry => {
      elements.push(
        <div className="d-flex justify-content-end">
          <Form.Group controlId={`asset${entry}`}>
            <Form.Label>{`asset ${entry}`}</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Project Asset" />
          </Form.Group>
          <Button variant="link" style={{color: 'red', fontSize: '30px'}} onClick={() => this.removeAsset(entry)}>
          ×
          </Button>
        </div>
      )
    })
    return elements
  }

  removeAsset(entry) {
    const {entries} = this.state
    const filteredEntries = entries.filter(oldEntry => {
      return oldEntry !== entry
    })
    this.setState({entries: [...filteredEntries]})
  }

  handleSubmit(event) {
    console.log(event.target)
  }

  render() {
    console.log(this.state.entries)
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

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              size="md" 
              type="file"
              accept="image/*" 
             />
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

          {this.renderEntries()}

          <Button variant="link" onClick={() => this.setState({entries: [...this.state.entries, this.state.entries[this.state.entries.length - 1] + 1]})}>
            + Asset
          </Button>

          <hr />

          <Button variant="outline-success" type="submit">
            Create
          </Button>
        </Form>
      </div>
    )
  }
}
