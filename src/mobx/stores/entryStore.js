import { observable, makeObservable, action, toJS, runInAction } from 'mobx';
import {
  getEntry as getEntryAPICall,
} from '../../config/api'

export default class EntryStore {
  constructor() {
    this.entryInfo = null
    this.entryInfoLoading = false

    makeObservable(this, {
      entryInfo: observable,
      getEntryInfo: action,
    })
  }

  async getEntryInfo(entryId) {
    this.entryInfoLoading = true
    try {
      const res = await getEntryAPICall(entryId)
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.entryInfo = data
          this.entryInfoLoading = false
        })
      }
      return res
    } catch(err) {
      console.log(err)
      this.entryInfoLoading = false
    }
  }
}