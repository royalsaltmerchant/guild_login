import { inject, observer } from 'mobx-react'
import React, {useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import downloadFile from '../utils/presignedDownloadFile'
import { toJS } from 'mobx'
import { editContributedAsset as editContributedAssetAPICall, editContribution as editContributionAPICall, editUser as editUserAPICall } from '../config/api'
import {BsDownload} from 'react-icons/bs'
import {AiOutlineSound} from 'react-icons/ai'

const ManageContribution = inject('contributionStore', 'projectsStore', 'entryStore', 'userStore')(observer((props) => {
  const params = useParams()
  const history = useHistory()
  const [assetURLs, setAssetURLs] = useState([])
  const [coinsToGive, setCoinsToGive] = useState(0)
  const [approvedAssetCount, setApprovedAssetCount] = useState(0)
  
  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const contributionId = params.id
    // get contribution data
    const contributionInfoRes = await props.contributionStore.getContributionInfo(contributionId)
    // get project title
    const projectInfoRes = await props.projectsStore.getProjectInfo(contributionInfoRes.data.project_id)
    const projectTitle = projectInfoRes.data.title
    // get entry title
    const entryInfoRes = await props.entryStore.getEntryInfo(contributionInfoRes.data.entry_id)
    const entryTitle = entryInfoRes.data.title
    // get user username
    const userInfoRes = await props.userStore.getUserInfo(contributionInfoRes.data.user_id)
    const userName = `${userInfoRes.data.first_name}_${userInfoRes.data.last_name}`
    // get urls for contributed assets
    const contributedAssetsURLs = []
    const contributedAssets = contributionInfoRes.data.contributed_assets
    await Promise.all(
      contributedAssets.map(async asset => {
        const assetName = asset.name
        const assetUUID = asset.uuid
        const objectName = `submissions/${projectTitle}/${entryTitle}/${userName}/${assetUUID}.wav`
        const presignedURL = await downloadFile(objectName)
        contributedAssetsURLs.push({name: assetName, uuid: assetUUID, url: presignedURL})
      })
    )
    setAssetURLs(contributedAssetsURLs)
  }

  async function handleComplete() {
    await handleUpdateContributionStatus()
    if(coinsToGive !== 0) await handleUpdateUserInfo()
    history.push('/dashboard')
  }

  async function handleUpdateContributionStatus() {
    const {contributionInfo} = props.contributionStore
    const params = {
      contribution_id: contributionInfo.id,
      status: coinsToGive !== 0 ? 'Accepted' : 'Rejected'
    }
    try {
      await editContributionAPICall(params)
    } catch(err) {
      console.log(err)
      alert('Failed to update entry status')
    }
  }

  async function handleUpdateUserInfo() {
    const {contributionInfo} = props.contributionStore
    const params = {
      user_id: contributionInfo.user_id,
      coins: coinsToGive,
      approved_asset_count: approvedAssetCount
    }
    try {
      const res = await editUserAPICall(params)
    } catch(err) {
      console.log(err)
      alert('Failed to send coins')
    }
  }

  function handlePlayAudio(assetUUID) {
    const assetURL = assetURLs.filter(URL => URL.uuid === assetUUID)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }

  async function handleApproveOrReject(assetId, status) {
    const params = {
      contributed_asset_id: assetId,
      status: status
    }
    try {
      const res = await editContributedAssetAPICall(params)
      if(res.status === 200) {
        getData()
        if(status === 'approved') {
          setCoinsToGive(coinsToGive + 10)
          setApprovedAssetCount(approvedAssetCount + 1)
        }
      } else throw new Error
    } catch(err) {
      console.log(err)
    }
  }

  function handleDownload(assetUUID) {
    const assetURL = assetURLs.filter(URL => URL.uuid === assetUUID)[0]
    const link = document.createElement("a")
    link.href = assetURL.url
    link.download = assetURL.name
    link.click()
  }

  function renderManageButtonsByStatus(asset) {
    const {status} = asset
    
    if(!status || status === 'pending') {
      return(
        <div>
          <Button className="mr-3" variant="outline-success" onClick={() => handleApproveOrReject(asset.id, 'approved')}>Approve</Button>
          <Button className="mr-3" variant="outline-danger" onClick={() => handleApproveOrReject(asset.id, 'rejected')}>Reject</Button>
        </div>
      )
    }
    else if(status === 'approved') return <p className="mr-3" style={{color: 'green', margin: 0}}>approved</p>
    else return <p className="mr-3" style={{color: 'gray', margin: 0}}>{status}</p>
  }

  function renderContributedAssets() {
    
    if(props.contributionStore.contributionInfo) {
      const {contributionInfo} = props.contributionStore
      const contributedAssets = contributionInfo.contributed_assets.slice().sort((a, b) => a.name.localeCompare(b.name))
      const contributedAssetsMap = contributedAssets.map(asset => {
        return(
          <div className="py-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded" style={{backgroundColor: 'white'}}>
            <Button variant="link" onClick={() => handlePlayAudio(asset.uuid)}>{asset.name} <AiOutlineSound /></Button>
            <div className="d-flex flex-row align-items-baseline">
              {renderManageButtonsByStatus(asset)}
              <Button variant="link-secondary" style={{fontSize: '20px'}} onClick={() => handleDownload(asset.uuid)}><BsDownload /></Button>
            </div>
          </div>
        )
      })
      return contributedAssetsMap
    } 
    else {
      return <p>Can't get contributed assets</p>
    }

  }
  
  return (
    <div style={{width: '60vw'}}>
      <h2 className="pb-3">Asset Management</h2>
      {renderContributedAssets()}
      <br />
      <Button variant="outline-info" onClick={() => handleComplete()}>Complete with {coinsToGive} Coins</Button>
    </div>
  )
}))

export default ManageContribution
