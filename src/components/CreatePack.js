import React, { Component } from 'react'
import {Spinner, Button, Form} from 'react-bootstrap'
import {createPack as createPackAPICall} from '../config/api'
import {awsConfig} from '../config/config'
import { inject, observer } from 'mobx-react'
import presignedUploadFile from '../utils/presignedUploadFile'

class CreatePack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadingBoolean: false
    }
  }

  async uploadFile(file, fileDir) {
    const preSignedParams = {
      bucket_name: awsConfig.bucketName,
      object_name: fileDir,
    }

    return await presignedUploadFile(file, preSignedParams)
  }

  async handleSubmitPack(event) {
    event.preventDefault()
    const title = event.target.packTitle.value.trim()
    const description = event.target.packDescription.value.trim()
    const image = event.target.packImage.files[0].name
    const imageFile = event.target.packImage.files[0]
    const video = event.target.packVideo.value.trim()
    const coinCost = event.target.packCoinCost.value
    const audioFile = event.target.packAudio.files[0]

    const editedPackTitle = title.replaceAll(' ', '-').toLowerCase()
    const params = {
      title: title,
      description: description,
      image_file: image,
      video_file: video,
      coin_cost: coinCost
    }
    try {
      const res = await createPackAPICall(params)
      if(res.status === 201) {
        this.setState({uploadingBoolean: true})
        await this.uploadFile(imageFile, `pack_images/${imageFile.name}`)
        await this.uploadFile(audioFile, `packs/${editedPackTitle}/${audioFile.name}`)
        this.setState({uploadingBoolean: false})
        this.props.createPackBoolean(false)
        await this.props.packsStore.getPacks()
        this.props.getPackImageURLs()
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="p-3 border rounded card-style admin-tools-item">
        
        <Form onSubmit={(event) => this.handleSubmitPack(event)}>
          <Form.Group controlId="packTitle">
            <Form.Label>Title</Form.Label>
            <small className="ml-2" style={{color: 'green'}}>Title will auto-capitalize first letter of each word</small>
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
            <small className="ml-2" style={{color: 'red'}}>The embed url, not the regular url</small>
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

          <Form.Group controlId="packAudio">
            <Form.Label>Audio Package</Form.Label>
            <small className="ml-2" style={{color: 'red'}}>Must be a zipped folder!</small>
            <Form.Control 
              required
              size="md" 
              type="file"
              accept=".zip"
             />
          </Form.Group>
          {this.state.uploadingBoolean ? 
            <div>
              <Spinner animation="border" role="status" />
              <p style={{color: 'green'}}>This could take awhile...</p>
            </div> :
            <Button variant="outline-success" type="submit">
              Create Pack
            </Button>
          }
        </Form>
      </div>
    )
  }
}

export default inject('packsStore')(observer(CreatePack))
