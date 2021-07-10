import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'
import {createPack as createPackAPICall} from '../config/api'
import S3 from 'react-aws-s3'
import {awsConfig} from '../config/config'

export default class CreatePack extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  async uploadImageFile(imageFile) {
    const config = {
      bucketName: awsConfig.bucketName,
      dirName: "pack_images",
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

  async handleSubmitPack(event) {
    event.preventDefault()
    const title = event.target.packTitle.value.trim()
    const description = event.target.packDescription.value.trim()
    const image = event.target.packImage.files[0].name
    const imageFile = event.target.packImage.files[0]
    const video = event.target.packVideo.value.trim()
    const coinCost = event.target.packCoinCost.value
    
    try {
      const res = await createPackAPICall(title, description, image, video, coinCost)
      if(res.status === 201) {
        console.log(res)
        this.props.getAndUpdatePacks()
        this.props.createPackBoolean(false)
        this.uploadImageFile(imageFile)
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="px-3">
        
        <Form onSubmit={(event) => this.handleSubmitPack(event)}>
          <Form.Group controlId="packTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Pack Title"
            />
          </Form.Group>

          <Form.Group controlId="packImage">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="file"
              accept="image/*"
             />
          </Form.Group>

          <Form.Group controlId="packVideo">
            <Form.Label>Video Embed Link</Form.Label>
            <small class="ml-2" style={{color: 'red'}}>The embed url, not the regular url</small>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Pack Video Link"
            />
          </Form.Group>

          <Form.Group controlId="packDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              required
              size="md"
              type="text"
              placeholder="Pack Description"
            />
          </Form.Group>

          <Form.Group controlId="packCoinCost">
            <Form.Label>Coin Cost</Form.Label>
            <Form.Control 
              required
              size="md"
              type="number"
              placeholder="Pack Coin Cost"
            />
          </Form.Group>

          <Button variant="outline-success" type="submit">
            Create Pack
          </Button>
        </Form>
      </div>
    )
  }
}
