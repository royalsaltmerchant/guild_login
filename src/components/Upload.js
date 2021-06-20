import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

export default class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filesList: []
    }
  }

  handleSubmit(event) {
    const {filesList} = this.state

    event.preventDefault()
    console.log(event.target.file.files)
    this.setState({
      filesList: [...filesList, ...event.target.file.files]
    })
  }

  renderFilesList() {
    const {filesList} = this.state

    const list = filesList.map(file => (
      <p>{file.name}</p>
    ))
    return list
  }

  render() {
    const {filesList} = this.state
    console.log('files list state',filesList)
    return (
      <div>
        <p>File List:</p>
        <div className="p-1 rounded border border-dark" style={{width: '60vw', height: '25vh', backgroundColor: '#fff', overflow: 'scroll'}}>
          {this.renderFilesList()}
        </div>
        <hr />
        <Form onSubmit={(event) => this.handleSubmit(event)}>
          <Form.Group controlId="file">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="file" 
              multiple
              accept="audio/*"
            />
          </Form.Group>
            <Button variant="outline-dark" type="submit">
              Upload
            </Button>
        </Form>    
      </div>
    )
  }
}
