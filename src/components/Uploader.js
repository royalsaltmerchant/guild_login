import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import UploadFiles from '../utils/UploadFiles'
import {Prompt} from 'react-router-dom'

export default function Uploader(props) {
  const [successList, setSuccessList] = useState([])
  const [failedList, setFailedList] = useState([])

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
    const totalAmountOfContributionAttempts = props.calculateTotalAmountOfContributionAttempts ? props.calculateTotalAmountOfContributionAttempts(toUploadFilesListAmount) : null
    if(!totalAmountOfContributionAttempts) return
    const filesSuccessOrFailed = await UploadFiles(props.dirName, toUploadFilesList)

    const newSuccessList = filesSuccessOrFailed.successList
    const newFailedList = filesSuccessOrFailed.failedList

    setSuccessList([...successList, ...newSuccessList])
    setFailedList([...failedList, ...newFailedList])
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

  return (
    <div>
      <Prompt
        when={successList.length != 0 && !props.complete}
        message="If you leave without pressing Complete your uploads will be lost! Are you sure you want to navigate away?"
      />
      <p>Uploaded Files:</p>
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
            accept="audio/*"
          />
        </Form.Group>
          <Button variant="outline-success" type="submit">
            Upload Files
          </Button>
      </Form>
      <br />
      <small style={{color: 'red'}}>* Do not navigate away without clicking complete, or your uploads will not register!</small>
      <Button variant="info" className="w-100" disabled={successList.length === 0} onClick={() => props.handleComplete(successList)}>
        Complete
      </Button>  
    </div>
  )
}
