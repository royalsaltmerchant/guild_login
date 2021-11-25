import React, { useState, useEffect } from 'react'
import { Form, Button, Spinner, Alert } from 'react-bootstrap'
import {inject, observer} from 'mobx-react'
import {awsConfig} from '../config/config'
import S3 from 'react-aws-s3'
import {useHistory, useParams, Prompt} from 'react-router-dom'
import {
  createContribution as createContributionAPICall,
  createContributedAsset as createContributedAssetAPICall
} from '../config/api'

const Upload = inject('entryStore', 'userStore', 'projectsStore')(observer((props) => {
  const [alert, setAlert] = useState(false)
  const [alertType, setAlertType] = useState('warning')
  const [alertText, setAlertText] = useState('Something went wrong, please try again.')
  const [successList, setSuccessList] = useState([])
  const [failedList, setFailedList] = useState([])
  const [complete, setComplete] = useState(false)
  const history = useHistory()
  const entryParams = useParams()

  useEffect(async () => {
    await props.entryStore.getEntryInfo(entryParams.entryId)
    props.projectsStore.getProjectInfo(props.entryStore.entryInfo.project_id)
    props.userStore.getUserInfo()
  },[])

  useEffect(() => {
    if(successList.length !== 0 && !complete) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  })

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 10000)
  },[alert])

  function renderAlert() {
    if(alert) {
      return(
        <Alert variant={alertType}>
          {alertText}
        </Alert>
      )
    }
  }

  async function handleComplete() {
    
    const contributionSuccess = await handleContributionCall()
    if(contributionSuccess) {
      const contributionId = contributionSuccess.data.id
      await Promise.all(
        successList.map(async asset => {
          try {
            const params = {
              contribution_id: contributionId,
              name: asset
            }
            await createContributedAssetAPICall(params)
          } catch(err) {
            console.log(err)
          }
        })
        )
        setComplete(true)
        history.push('/dashboard')
    }
  }
  
  async function handleContributionCall() {
    const {entryInfo} = props.entryStore
    const amount = successList.length
    const params = {
        entry_id: entryInfo.id,
        project_id: entryInfo.project_id,
        amount: amount
      }
    try {
      const res = await createContributionAPICall(params)
      if(res.status === 201) {
        return res
      }
      else {
        return false
      }
    } catch(err) {
      setAlertText('Something went wrong, please try again.')
      setAlertType('danger')
      setAlert(true)
      return false
    }
  }

  async function handleUploadFiles(event) {
    event.preventDefault()
    const {entryInfo} = props.entryStore
    const {userInfo} = props.userStore
    const {projectInfo} = props.projectsStore

    const toUploadFilesList = Object.values(event.target.file.files)

    // calculate amount of contributions user has made and will make
    const userContributions = userInfo.contributions
    let userContributionsAmount = 0
    userContributions.forEach(contribution => {
      if(contribution.entry_id === entryInfo.id) userContributionsAmount += contribution.amount
    });
    const toUploadFilesListAmount = toUploadFilesList.length
    const totalAmountOfContributionsAttempt = toUploadFilesListAmount + userContributionsAmount

    // only upload if maximum will not be reached in this attempt
    if(totalAmountOfContributionsAttempt <= entryInfo.amount) {
      const config = {
        bucketName: awsConfig.bucketName,
        dirName: `submissions/${projectInfo.title}/${entryInfo.title}/${userInfo.first_name}_${userInfo.last_name}`,
        region: awsConfig.region,
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey
      }
      const S3Client = new S3(config)
      const newSuccessList = []
      const newFailedList = []
      
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
      setSuccessList([...successList, ...newSuccessList])
      setFailedList([...failedList, ...newFailedList])
    } else {
      window.alert(`You have reached or exceeded the maximum limit of ${entryInfo.amount} contributions for this entry.`)
      history.push('/dashboard')
    }
  }

  function renderFilesSuccessList() {
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

  function renderFilesFailedList() {
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
  
  function renderUploaderOrLoading() {

    if(props.entryStore.entryInfoLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!props.entryStore.entryInfo) {
      return <p>Can't Load Info</p>
    }

    const {entryInfo} = props.entryStore
    return(
      <div>
        <Prompt
          when={successList.length != 0 && !complete}
          message="If you leave without pressing Complete your contribution will be lost! Are you sure you want to navigate away?"
        />
        <h2 className="text-center">{entryInfo.title}</h2>
        <p className="text-center">{entryInfo.description}</p>
        {renderAlert()}
        <p>Uploaded Files:</p>
        <div className="p-1 rounded border border-dark" style={{width: '60vw', height: '25vh', backgroundColor: '#fff', overflowY: 'auto'}}>
          {renderFilesSuccessList()}
          {renderFilesFailedList()}
        </div>
        <hr />
        <Form onSubmit={(event) => handleUploadFiles(event)}>
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
        <Button variant="info" className="w-100" disabled={successList.length === 0} onClick={() => handleComplete()}>
          Complete
        </Button>    
      </div>
    )
  }

  return (
    <div>
      {renderUploaderOrLoading()}
    </div>
  )
}))

export default Upload

