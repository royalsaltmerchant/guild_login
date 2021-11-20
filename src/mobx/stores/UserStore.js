import { observable, makeObservable, action, toJS } from 'mobx';
import {
  getUser as getUserAPICall,
  getUsers as getUsersAPICall
} from '../../config/api'

export default class UserStore {
  constructor() {
    this.userInfo = null
    this.usersList = null
    this.userInfoLoading = true
    this.usersListLoading = true

    makeObservable(this, {
      userInfo: observable,
      usersList: observable,
      userInfoLoading: observable,
      usersListLoading: observable,
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
        this.userInfoLoading = false
      }
      return res
    } catch(err) {
      console.log(err)
      this.userInfoLoading = false
    }
  }

  async getUsersList() {
    try {
      const res = await getUsersAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.usersList = data
        this.usersListLoading = false
      }
      return res
    } catch(err) {
      console.log(err)
      this.usersListLoading = false
    }
  }
}