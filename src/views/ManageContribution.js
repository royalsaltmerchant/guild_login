import { inject, observer } from 'mobx-react'
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

const ManageContribution = inject('contributionStore')(observer((props) => {
  const params = useParams()

  useEffect(async () => {
    const contributionId = params.id
    props.contributionStore.getContributionInfo(contributionId)
  }, [])
  
  return (
    <div className="d-flex flex-column flex-wrap justify-content-center w-75 p-3 border border-light rounded" style={{backgroundColor: '#fff'}}>
      
    </div>
  )
}))

export default ManageContribution
