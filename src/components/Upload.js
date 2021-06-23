import React, { Component } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import {inject, observer} from 'mobx-react'
import {awsConfig} from '../config/config'
import S3 from 'react-aws-s3'
import {withRouter} from 'react-router-dom'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      successList: [],
      failedList: [],
      hasEntry: false,
      loadingEntry: true
    }
  }

  componentDidMount() {
    this.getAndUpdateEntry()
  }

  async getAndUpdateEntry() {
    this.setState({hasEntry: false, loadingEntry: true}, () => {
      try {
        const res = await this.props.entryStore.getEntryInfo()
        if(res.status === 200) {
          this.setState({
            hasEntry: true,
            loadingEntry: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasEntry: false,
          loadingEntry: false
        })
      }
    })
  }

  async handleSubmit(event) {
    // const {project, user} = this.props
    const config = {
      bucketName: awsConfig.bucketName,
      // dirName: `${project}/${user}`,
      region: awsConfig.region,
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey
    }
    event.preventDefault()
    const toUploadFilesList = Object.values(event.target.file.files)
    const S3Client = new S3(config)
    const successList = []
    const failedList = []
    await Promise.all(
      toUploadFilesList.map(async file => {
        try {
          const res = await S3Client.uploadFile(file, file.name)
          if(res.status === 204 || res.status === 200) {
            console.log('success', file.name)
            successList.push(file.name)
          } else {
            console.log('failed', file.name)
            failedList.push(file.name)
          }
        } catch(err) {
          console.log('failed', file.name)
          failedList.push(file.name)
        }
      })
    )
    this.setState({
      successList: [...this.state.successList, ...successList],
      failedList: [...this.state.failedList, ...failedList]
    })
  }

  renderFilesSuccessList() {
    const {successList} = this.state
    if(successList.length !== 0) {
      const mapList = successList.map(item => (
        <div key={item} className="d-flex justify-content-between">
          <p>{item}</p>
          <p style={{color: 'green'}}>✓</p>
        </div>
      ))
      return mapList
    }
  }

  renderFilesFailedList() {
    const {failedList} = this.state
    if(failedList.length !== 0) {
      const mapList = failedList.map(item => (
        <div key={item} className="d-flex justify-content-between">
          <p>{item}</p>
          <p style={{color: 'red'}}>Failed</p>
          <hr />
        </div>
      ))
      return mapList
    }
  }

  renderUploaderOrLoading() {
    const {hasEntry, loadingEntry} = this.state
    if(hasEntry && !loadingEntry) {
      return(
        <div>
          <h2 className="text-center">something</h2>
          <p>Uploaded Files:</p>
          <div className="p-1 rounded border border-dark" style={{width: '60vw', height: '25vh', backgroundColor: '#fff', overflowY: 'auto'}}>
            {this.renderFilesSuccessList()}
            {this.renderFilesFailedList()}
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
              <Button variant="outline-success" type="submit">
                Upload
              </Button>
          </Form>    
        </div>
      )
    }
    if(!hasEntry && !loadingEntry) {
      return <div>
      <p>Can't Load Entry, Try Again</p>
      <Button onClick={() => this.getAndUpdateEntry()}>Try Again</Button>
    </div>
    }
    if(loadingEntry) {
      return <Spinner />
    }
  }

  render() {
    console.log(this.props.match.params.entryId)
    return (
      <div>
        {this.renderUploaderOrLoading()}
      </div>
    )
  }
}

export default inject('entryStore')(observer(withRouter(Upload)))
