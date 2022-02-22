import { inject, observer } from 'mobx-react'
import React, { Component, useState } from 'react'
import { useEffect } from 'react'
import {useHistory} from 'react-router-dom'
const Logout = inject('userStore')(observer((props) => {
  const history = useHistory()
  const [logoutMessage, setLogoutMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      localStorage.removeItem('token')
      props.userStore.clearUserInfo()
      history.push('/login')
      props.authenticate()
    } else {
        setLogoutMessage('not logged in')
    }
  })
  
    return (
      <div>
        <h1>Logout</h1>
        <p>{logoutMessage}</p>
      </div>
    )

}))


export default Logout
