import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {
  getEntry as getEntryAPICall,
} from '../../config/api'

export default class EntryStore extends Component {
  constructor() {
    super()

    this.entryInfo = null

    makeObservable(this, {
      entryInfo: observable,
      getEntryInfo: action,
    })
  }

  async getEntryInfo(entryId) {
    try {
      const res = await getEntryAPICall(entryId)
      if(res.status === 200) {
        const data = toJS(res.data)
        this.entryInfo = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }
}