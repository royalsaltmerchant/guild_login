import { inject, observer } from 'mobx-react'
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import downloadFiles from '../utils/DownloadFIles'
import { toJS } from 'mobx'

const ManageContribution = inject('contributionStore', 'projectsStore', 'entryStore', 'userStore')(observer((props) => {
  const params = useParams()
  const [assetURLs, setAssetURLs] = useState([])
  
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
    console.log(userInfoRes)
    const userName = `${userInfoRes.data.first_name}_${userInfoRes.data.last_name}`
    // get urls for contributed assets
    const contributedAssetsURLs = []
    const contributedAssets = contributionInfoRes.data.contributed_assets
    await Promise.all(
      contributedAssets.map(async asset => {
        const assetName = asset.name
        const objectName = `submissions/${projectTitle}/${entryTitle}/${userName}/${assetName}`
        const presignedURL = await downloadFiles(objectName)
        contributedAssetsURLs.push({name: assetName, url: presignedURL})
      })
    )
    setAssetURLs(contributedAssetsURLs)
  }

  function handlePlayAudio(assetName) {
    const assetURL = assetURLs.filter(URL => URL.name === assetName)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }

  function handleDownload(assetName) {
    const assetURL = assetURLs.filter(URL => URL.name === assetName)[0]
    const link = document.createElement("a")
    link.href = assetURL.url
    link.download = assetURL.name
    link.click()
  }

  function renderContributedAssets() {
    
    if(props.contributionStore.contributionInfo) {
      console.log(assetURLs)
      const {contributionInfo} = props.contributionStore
      const contributedAssets = contributionInfo.contributed_assets
      const contributedAssetsMap = contributedAssets.map(asset => {
        return(
          <div className="pt-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded">
            <Button variant="link" onClick={() => handlePlayAudio(asset.name)}>{asset.name}</Button>
            <div>
            <Button className="mr-3" variant="outline-success">Approve</Button>
            <Button className="mr-3" variant="outline-danger">Reject</Button>
            <Button variant="outline-secondary" onClick={() => handleDownload(asset.name)}>Download</Button>
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
    <div className="d-flex flex-column flex-wrap justify-content-center w-75 p-3 border border-light rounded" style={{backgroundColor: '#fff'}}>
      {renderContributedAssets()}
      <br />
      <div className="d-flex justify-content-center ">
        <Button className="mx-3" variant="outline-success">Approve All</Button>
        <Button variant="outline-danger">Reject All</Button>
      </div>
    </div>
  )
}))

export default ManageContribution
