import { observable, makeObservable, action, toJS, runInAction } from 'mobx';
import {
  editUser as editUserApiCall,
  getUser as getUserAPICall,
  getUsers as getUsersAPICall
} from '../../config/api'

export default class UserStore {
  constructor() {
    this.userInfo = null
    this.usersList = null
    this.userInfoLoading = false
    this.usersListLoading = false

    makeObservable(this, {
      userInfo: observable,
      usersList: observable,
      userInfoLoading: observable,
      usersListLoading: observable,
      getUserInfo: action,
      getUsersList: action,
      editUserInfo: action
    })
  }

  async getUserInfo() {
    this.userInfoLoading = true
    try {
      const res = await getUserAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.userInfo = data
          this.userInfoLoading = false
        })
      }
      return res
    } catch(err) {
      console.log(err)
      this.userInfoLoading = false
    }
  }

  async getUsersList() {
    this.usersListLoading = true
    try {
      const res = await getUsersAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.usersList = data
          this.usersListLoading = false
        })
      }
      return res
    } catch(err) {
      console.log(err)
      this.usersListLoading = false
    }
  }

  async editUserInfo(params) {
    try {
      const res = await editUserApiCall(params)
      if(res.status === 200) {
        this.getUserInfo()
      } else throw new Error()
    } catch(err) {
      console.log(err)
    }
  }
}