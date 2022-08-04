import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import {Button, Form} from 'react-bootstrap'
import {createAssetType as createAssetTypeAPICall} from '../config/api'

class CreateAssetType extends Component {

  async handleSubmitAssetType(event) {
    event.preventDefault()
    const packId = this.props.packId
    const description = event.target.assetTypeDescription.value.trim()
    const params = {
      pack_id: packId,
      description: description
    }
    try {
      const res = await createAssetTypeAPICall(params)
      if(res.status === 201) {
        this.props.packsStore.getPacks()
        this.props.createAssetTypeBoolean(false)
      }
    } catch(err) {
      console.log(err)
    }
  }

  render() {
    return(
      <div className="p-3 card-style border rounded">
        <Form onSubmit={(event) => this.handleSubmitAssetType(event)}>

          <Form.Group controlId="assetTypeDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder="Asset Type Description"
            />
          </Form.Group>

          <Button variant="outline-success" type="submit">
            Create Asset Type
          </Button>
        </Form>
      </div>
    )
  }
}

export default inject('packsStore')(observer(CreateAssetType))
