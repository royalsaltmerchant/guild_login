import React, { useState, useEffect } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import {inject, observer} from 'mobx-react'
import {useHistory, useParams} from 'react-router-dom'
import {
  createContribution as createContributionAPICall,
  createContributedAsset as createContributedAssetAPICall
} from '../config/api'
import Uploader from '../components/Uploader'

const Upload = inject('entryStore', 'userStore', 'projectsStore')(observer((props) => {
  const [complete, setComplete] = useState(false)
  const history = useHistory()
  const entryParams = useParams()

  useEffect(async () => {
    await props.entryStore.getEntryInfo(entryParams.entryId)
    props.projectsStore.getProjectInfo(props.entryStore.entryInfo.project_id)
    props.userStore.getUserInfo()
  },[])

  async function handleComplete(successList) {
    
    const contributionSuccess = await handleContributionCall(successList)
    if(contributionSuccess) {
      const contributionId = contributionSuccess.data.id
      await Promise.all(
        successList.map(async file => {
          try {
            const params = {
              contribution_id: contributionId,
              name: file.name
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
  
  async function handleContributionCall(successList) {
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
      return false
    }
  }

  async function calculateTotalAmountOfContributionAttempts(toUploadFilesListAmount) {
    const {entryInfo} = props.entryStore
    const {userInfo} = props.userStore

    // calculate amount of contributions user has made and will make
    const userContributions = userInfo.contributions
    let userContributionsAmount = 0
    userContributions.forEach(contribution => {
      if(contribution.entry_id === entryInfo.id) userContributionsAmount += contribution.amount
    });
    const totalAmountOfContributionAttempts = toUploadFilesListAmount + userContributionsAmount
    // only upload if maximum will not be reached in this attempt
    if(totalAmountOfContributionAttempts <= entryInfo.amount) {
      return totalAmountOfContributionAttempts
    } else {
      window.alert(`You have reached or exceeded the maximum limit of ${entryInfo.amount} contributions for this entry.`)
      history.push('/dashboard')
      return null
    }
  }
  
  function renderUploaderOrLoading() {

    if(props.entryStore.entryInfoLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!props.entryStore.entryInfo || !props.projectsStore.projectInfo || !props.userStore.userInfo) {
      return <p>Can't Load Info</p>
    }

    const {entryInfo} = props.entryStore
    const {projectInfo} = props.projectsStore
    const {userInfo} = props.userStore
    const dirName = `submissions/${projectInfo.title}/${entryInfo.title}/${userInfo.first_name}_${userInfo.last_name}`
    return(
      <div>
        <h2>{entryInfo.title}</h2>
        <p>{entryInfo.description}</p>
        <hr />
        <Uploader
          dirName={dirName}
          complete={complete}
          handleComplete={(successList) => handleComplete(successList)}
          calculateTotalAmountOfContributionAttempts={calculateTotalAmountOfContributionAttempts}
        />  
      </div>
    )
  }

  return (
    <div style={{width: '50vw'}}>
      {renderUploaderOrLoading()}
    </div>
  )
}))

export default Upload

