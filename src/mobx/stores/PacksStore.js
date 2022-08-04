import { observable, runInAction, makeObservable, action, toJS } from 'mobx';
import {
  getPacks as getPacksAPICall,
  getPack as getPackAPICall
} from '../../config/api'

export default class PacksStore {
  constructor() {
    this.packs = null
    this.packInfo = null
    this.packsLoading = false
    this.packInfoLoading = false

    makeObservable(this, {
      packs: observable,
      packInfo: observable,
      packsLoading: observable,
      packInfoLoading: observable,
      getPacks: action,
      getPackInfo: action
    })
  }

  async getPacks() {
    this.packsLoading = true
    try {
      const res = await getPacksAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.packs = data
          this.packsLoading = false
        })
        return res
      } else throw new Error()
    } catch(err) {
      console.log(err)
      this.packsLoading = false
    }
  }

  async getPackInfo(packTitle) {
    this.packInfoLoading = true
    try {
      const res = await getPackAPICall(packTitle)
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.packInfo = data
          this.packInfoLoading = false
        })
        return res
      } else throw new Error()
    } catch(err) {
      console.log(err)
      this.packInfoLoading = false
    }
  }
}