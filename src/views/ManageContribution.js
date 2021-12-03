import { inject, observer } from 'mobx-react'
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'

const ManageContribution = inject('contributionStore')(observer((props) => {
  const params = useParams()

  useEffect(() => {
    getData()
  }, [])

  function getData() {
    const contributionId = params.id
    props.contributionStore.getContributionInfo(contributionId)
  }

  function renderContributedAssets() {
    
    if(props.contributionStore.contributionInfo) {
      const {contributionInfo} = props.contributionStore
      const contributedAssets = contributionInfo.contributed_assets
      const contributedAssetsMap = contributedAssets.map(asset => {
        return(
          <div className="pt-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded">
            <p>{asset.name}</p>
            <div>
            <Button className="mx-3" variant="outline-success">Approve</Button>
            <Button variant="outline-danger">Reject</Button>
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
    </div>
  )
}))

export default ManageContribution
