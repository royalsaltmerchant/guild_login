import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import {Button, Form} from 'react-bootstrap'
import {createEntry as createEntryAPICall} from '../config/api'

class CreateEntry extends Component {

  async handleSubmitEntry(event) {
    event.preventDefault()
    const projectId = this.props.projectId
    const amount = event.target.entryAmount.value
    const title = event.target.entryTitle.value
    const description = event.target.entryDescription.value
    const params =  {
      project_id: projectId,
      amount: amount,
      title: title,
      description: description
    }
    try {
      const res = await createEntryAPICall(params)
      if(res.status === 201) {
        this.props.projectsStore.getProjects()
        this.props.createEntryBoolean(false)
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return(
      <div className="p-3 card-style border rounded">
        <Form onSubmit={(event) => this.handleSubmitEntry(event)}>

          <Form.Group controlId="entryAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              required
              size="md"
              type="number"
              placeholder="Entry Amount"
            />
          </Form.Group>

          <Form.Group controlId="entryTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Entry Title"
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

export default inject('projectsStore')(observer(CreateEntry))
