import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'
import {createProject as createProjectAPICall} from '../config/api'
import S3 from 'react-aws-s3'
import {awsConfig} from '../config/config'
import { inject, observer } from 'mobx-react'

class CreateProject extends Component {

  async uploadImageFile(imageFile) {
    const config = {
      bucketName: awsConfig.bucketName,
      dirName: "project_images",
      region: awsConfig.region,
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey
    }
    const S3Client = new S3(config)

    try {
      const res = await S3Client.uploadFile(imageFile, imageFile.name)
      console.log(res)
      if(res.status === 204) {
        console.log('succesful upload to aws')
      }
    } catch(err) {
      console.log('failed to upload image to amazon',err)
    }
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
        console.log(res)
        this.props.projectsStore.getProjects()
        this.props.createProjectBoolean(false)
        this.uploadImageFile(imageFile)
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