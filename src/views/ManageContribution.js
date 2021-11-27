import { inject, observer } from 'mobx-react'
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {getContribution as getContributionAPICall} from '../config/api'

const ManageContribution = inject('contributionStore')(observer(() => {
  const params = useParams()

  useEffect(() => {
    console.log(params)
    getContributionAPICall()
  }, [])
  
  return (
    <div className="w-50">
      
    </div>
  )
}))

export default ManageContribution
