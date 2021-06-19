import { observable, makeObservable, action } from 'mobx';
import React, { Component } from 'react'

export default class UserStore extends Component {
  constructor() {
    makeObservable(this, {
      userInfo: observable,
      getUserInfo: action
    })
    this.userInfo = null
  }
  
}