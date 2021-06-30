import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {
  getPacks as getPacksAPICall,
  getPack as getPackAPICall
} from '../../config/api'

export default class PacksStore extends Component {
  constructor() {
    super()

    this.packs = null
    this.packInfo = null

    makeObservable(this, {
      packs: observable,
      packInfo: observable,
      getPacks: action,
      getPackInfo: action
    })
  }

  async getPacks() {
    try {
      const res = await getPacksAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.packs = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }

  async getPackInfo(packId) {
    try {
      const res = await getPackAPICall(packId)
      if(res.status === 200) {
        const data = toJS(res.data)
        this.packInfo = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }
}