import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'
import {createProject as createProjectAPICall} from '../config/api'
import {awsConfig} from '../config/config'
import { inject, observer } from 'mobx-react'
import presignedUploadFile from '../utils/presignedUploadFile'

class CreateProject extends Component {

  async uploadImageFile(file) {
    const preSignedParams = {
      bucket_name: awsConfig.bucketName,
      object_name: `project_images/${file.name}`,
    }

    return await presignedUploadFile(file, preSignedParams)
  }

  async handleSubmitProject(event) {
    event.preventDefault()
    const title = event.target.projectTitle.value
    const description = event.target.projectDescription.value
    const image = event.target.projectImage.files[0].name
    const imageFile = event.target.projectImage.files[0]
    const params = {
      title: title,
      description: description,
      image_file: image
    }
    try {
      const res = await createProjectAPICall(params)
      if(res.status === 201) {
        await this.props.projectsStore.getProjects()
        this.props.createProjectBoolean(false)
        await this.uploadImageFile(imageFile)
        this.props.getProjectImageURLs()
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="p-3 border rounded card-style admin-tools-item">
        
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
              required
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

export default inject('projectsStore')(observer(CreateProject))