import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {getUser as getUserAPICall} from '../../config/api'

export default class UserStore extends Component {
  constructor() {
    super()

    this.userInfo = null

    makeObservable(this, {
      userInfo: observable,
      getUserInfo: action
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
}