import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import uploadAudioFiles from '../utils/uploadAudioFiles'
import {Prompt} from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

export default function Uploader(props) {
  const [successList, setSuccessList] = useState([])
  const [failedList, setFailedList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [completeLoading, setCompleteLoading] = useState(false)

  useEffect(() => {
    if(successList.length !== 0 && !props.complete) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  })

  async function handleUploadFiles(event) {
    event.preventDefault()
    const toUploadFilesList = Object.values(event.target.file.files)
    const toUploadFilesListAmount = toUploadFilesList.length
    if(props.calculateTotalAmountOfContributionAttempts) {
      const totalAmountOfContributionAttempts = props.calculateTotalAmountOfContributionAttempts(toUploadFilesListAmount)
      if(!totalAmountOfContributionAttempts) return
    }
    if(props.calculateCanUploadMoreIfNotPremium) {
      const canUploadMoreIfNotPremium = props.calculateCanUploadMoreIfNotPremium(toUploadFilesListAmount)
      if(!canUploadMoreIfNotPremium) {
        window.alert(`You have exceeded the maximum limit of uploads, please upgrade to premium for more.`)
        return
      }
    }
    setUploading(true)
    const filesSuccessOrFailed = await uploadAudioFiles(props.dirName, toUploadFilesList)
    setUploading(false)
    const newSuccessList = filesSuccessOrFailed.successList
    const newFailedList = filesSuccessOrFailed.failedList

    setSuccessList([...successList, ...newSuccessList])
    setFailedList([...failedList, ...newFailedList])
  }

  function renderFilesSuccessList() {
    if(successList.length !== 0) {
      const mapList = successList.map(file => (
        <div key={file} className="d-flex justify-content-between">
          <p>{file.name}</p>
          <p style={{color: 'green'}}>✓</p>
        </div>
      ))
      return mapList
    } else return <p style={{color: 'grey'}}>No Successful Uploads</p>
  }

  function renderFilesFailedList() {
    if(failedList.length !== 0) {
      const mapList = failedList.map(file => (
        <div key={file} className="d-flex justify-content-between">
          <p>{file.name}</p>
          <p style={{color: 'red'}}>{file.failMessage ? file.failMessage : null}</p>
          <br />
          <p style={{color: 'red'}}>Failed</p>
        </div>
      ))
      return mapList
    } else return <p style={{color: 'grey'}}>No Failed Uploads</p>
  }

  async function handleComplete() {
    setCompleteLoading(true)
    await props.handleComplete(successList)
    setCompleteLoading(false)
  }

  return (
    <div>
      <Prompt
        when={successList.length !== 0 && !props.complete}
        message="If you leave without pressing Complete your uploads will be lost! Are you sure you want to navigate away?"
      />
      <p>Upload SFX</p>
      <div className="p-1 rounded border border-dark" style={{height: '25vh', backgroundColor: '#fff', overflowY: 'auto'}}>
        {renderFilesSuccessList()}
        {renderFilesFailedList()}
      </div>
      <br />
      <Form onSubmit={(event) => handleUploadFiles(event)}>
        <Form.Group controlId="file">
          <Form.Control 
            required
            size="md" 
            type="file" 
            multiple
            accept="audio/wav"
          />
          <p style={{color: 'grey'}}>* only accepts .wav files</p>
        </Form.Group>
        {
          uploading ? <Spinner animation="border" role="status" /> :
          <Button variant="outline-success" type="submit">
            Upload Files
          </Button>
        }
      </Form>
      <br />
      <small style={{color: 'red'}}>* Do not navigate away without clicking complete, or your uploads will not register!</small>
      {
        completeLoading ? <Spinner animation="border" role="status" /> :
        <Button variant="info" className="w-100" disabled={successList.length === 0} onClick={() => handleComplete()}>
          Complete
        </Button>  
      }
    </div>
  )
}
