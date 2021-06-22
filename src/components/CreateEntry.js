import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'

export default class CreateEntry extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entryName: '',
      entryDescripton: '',
      entryAmount: 0
    }
  }

  removeAsset() {
  }

  handleSubmitEntry() {
    console.log()
  }

  render() {
    return(
      <div className="p-3">
        <Form onSubmit={(event) => this.handleSubmitEntry(event)}>

          <Form.Group controlId="entryAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              required
              size="md"
              type="number"
              placeholder="Entry Amount"
              onChange={number => this.setState({entryAmount: number})}
            />
          </Form.Group>

          <Form.Group controlId="entryTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Entry Title"
              onChange={text => this.setState({entryName: text})}
            />
          </Form.Group>

          <Form.Group controlId="entryDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              required
              size="md"
              type="text"
              placeholder="Entry Description"
              onChange={text => this.setState({entryDescripton: text})}
            />
          </Form.Group>

          <Button variant="outline-success" type="submit">
            Create Entry
          </Button>
        </Form>
      </div>
    )
  }
}
