import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {
  getUser as getUserAPICall,
  getUsers as getUsersAPICall
} from '../../config/api'

export default class UserStore extends Component {
  constructor() {
    super()

    this.userInfo = null
    this.usersList = null

    makeObservable(this, {
      userInfo: observable,
      usersList: observable,
      getUserInfo: action,
      getUsersList: action
    })
  }

  async getUserInfo() {
    try {
      const res = await getUserAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.userInfo = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }

  async getUsersList() {
    try {
      const res = await getUsersAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.usersList = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }
}