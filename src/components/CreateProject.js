import { entries } from 'mobx'
import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'

export default class CreateProject extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: [],
      entryIdCount: 0
    }
  }

  renderEntries() {
    const {entries} = this.state

    const listMap = entries.map(entry => entry.item)
    return listMap
  }

  addEntry() {
    const {entryIdCount} = this.state
    const list = []
    list.push(
      <div className="d-flex">
        <Form.Group controlId={`asset${entryIdCount}`}>
          <Form.Label>{`asset ${entryIdCount}`}</Form.Label>
          <Form.Control 
            required
            size="md"
            type="text"
            placeholder="Project Asset" />
        </Form.Group>
        <Button variant="link" style={{color: 'red', fontSize: '30px'}} onClick={() => this.removeAsset(entryIdCount)}>
          ×
        </Button>
      </div>
    )
    this.setState({
      entries: [...this.state.entries, {item: list, id: entryIdCount}]
    })
  }

  removeAsset(entryIdCount) {
    const {entries} = this.state
    const filteredEntries = entries.filter(entry => {
      return entry.id !== entryIdCount
    })
    this.setState({
      entries: filteredEntries
    })
  }

  handleSubmit(event) {
    console.log(event.target)
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

          <Button variant="link" onClick={() => this.setState({entryIdCount: this.state.entryIdCount + 1}, () => this.addEntry())}>
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
