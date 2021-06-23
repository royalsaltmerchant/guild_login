import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'
import {createProject as createProjectAPICall} from '../config/api'

export default class CreateProject extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: [],
      entryIdCount: 0,
      asset: [],
    }
  }

  async handleSubmitProject(event) {
    event.preventDefault()
    const title = event.target.projectTitle.value
    const description = event.target.projectDescription.value
    const image = event.target.projectImage.files[0].name
    const imageFile = event.target.projectImage.files[0]
    
    try {
      const res = await createProjectAPICall(title, description, image)
      if(res.status === 201) {
        console.log(res)
        this.props.getAndUpdateProjects()
        this.props.createProjectBoolean(false)
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="p-3">
        
        <Form onSubmit={(event) => this.handleSubmitProject(event)}>
          <Form.Group controlId="projectTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Project Title"
            />
          </Form.Group>

          <Form.Group controlId="projectImage">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              size="md" 
              type="file"
              accept="image/*"
             />
          </Form.Group>

          <Form.Group controlId="projectDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              required
              size="md"
              type="text"
              placeholder="Project Description"
            />
          </Form.Group>

          <Button variant="outline-success" type="submit">
            Create Project
          </Button>
        </Form>
      </div>
    )
  }
}
