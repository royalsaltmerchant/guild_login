import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'

export default class CreateProject extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: [],
      entryIdCount: 0,
      asset: [],
      projectName: '',
      projectDescripton: '',
      projectImage: null
    }
  }

  handleSubmitProject(event) {
    const {projectDescripton, projectName, projectImage} = this.state
    event.preventDefault()

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
              onChange={text => this.setState({projectName: text})}
            />
          </Form.Group>

          <Form.Group controlId="projectImage">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              size="md" 
              type="file"
              accept="image/*"
              onChange={image => this.setState({projectImage: image})}
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
              onChange={text => this.setState({projectDescripton: text})}
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
