import React, { Component } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import {inject, observer} from 'mobx-react'
import {awsConfig} from '../config/config'
import S3 from 'react-aws-s3'
import {withRouter} from 'react-router-dom'
import {createContribution as createContributionAPICall} from '../config/api'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      successList: [],
      failedList: [],
      hasEntry: false,
      hasProject: false,
      hasUser: false,
      loading: true
    }
  }

  componentDidMount() {
    this.getAndUpdateEntry()
    this.getAndUpdateUser()
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.hasEntry !== this.state.hasEntry) {
      this.getAndUpdateProject()
    }
  }

  async getAndUpdateEntry() {
    this.setState({hasEntry: false, loading: true}, async () => {
      try {
        const res = await this.props.entryStore.getEntryInfo(this.props.match.params.entryId)
        if(res.status === 200) {
          this.setState({
            hasEntry: true,
            loading: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasEntry: false,
          loading: false
        })
      }
    })
  }

  async getAndUpdateProject() {
    this.setState({hasProject: false, loading: true}, async () => {
      try {
        const res = await this.props.projectsStore.getProjectInfo(this.props.entryStore.entryInfo.project_id)
        if(res.status === 200) {
          this.setState({
            hasProject: true,
            loading: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasEntry: false,
          loading: false
        })
      }
    })
  }

  async getAndUpdateUser() {
    this.setState({hasUser: false, loading: true}, async () => {
      try {
        const res = await this.props.userStore.getUserInfo()
        if(res.status === 200) {
          this.setState({
            hasUser: true,
            loading: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasEntry: false,
          loading: false
        })
      }
    })
  }

  async handleComplete() {
    const {successList} = this.state
    const {entryInfo} = this.props.entryStore
    const amount = successList.length

    try {
      const res = await createContributionAPICall(entryInfo.id, entryInfo.project_id, amount)
      this.props.history.push('/dashboard')
    } catch(err) {
      console.log(err)
    }
  }

  async handleSubmit(event) {
    const {entryInfo} = this.props.entryStore
    const {userInfo} = this.props.userStore
    const {projectInfo} = this.props.projectsStore
    const config = {
      bucketName: awsConfig.bucketName,
      dirName: `${projectInfo.title}/${entryInfo.title}/${userInfo.first_name}_${userInfo.last_name}`,
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
    const {hasEntry, hasProject, hasUser, loading} = this.state
    const {entryInfo} = this.props.entryStore

    if(hasEntry && hasProject && hasUser && !loading) {
      return(
        <div>
          <h2 className="text-center">{entryInfo.title}</h2>
          <p className="text-center">{entryInfo.description}</p>
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
                Upload Files
              </Button>
          </Form>
          <br />
          <small style={{color: 'red'}}>* Do not navigate away without clicking complete, or your contribution will not register!</small>
          <Button variant="info" className="w-100" disabled={this.state.successList.length === 0} onClick={() => this.handleComplete()}>
            Complete
          </Button>    
        </div>
      )
    }
    if(!hasEntry || !hasProject || !hasUser && !loading) {
      return <div>
      <p>Can't Load Info, Try Again</p>
      <Button onClick={() => this.getAndUpdateEntry()}>Try Again</Button>
    </div>
    }
    if(loading) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div>
        {this.renderUploaderOrLoading()}
      </div>
    )
  }
}

export default inject('entryStore', 'projectsStore', 'userStore')(observer(withRouter(Upload)))
