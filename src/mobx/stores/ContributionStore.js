import { observable, makeObservable, action, toJS, runInAction } from 'mobx';
import {
  getContribution as getContributionAPICall,
} from '../../config/api'

export default class ContributionStore {
  constructor() {
    this.contributionInfo = null
    this.contributionInfoLoading = false

    makeObservable(this, {
      contributionInfo: observable,
      getContributionInfo: action,
    })
  }

  async getContributionInfo(contributionId) {
    this.contributionInfoLoading = true
    try {
      const res = await getContributionAPICall(contributionId)
      if(res.status === 200) {
        const data = toJS(res.data)
        runInAction(() => {
          this.contributionInfo = data
          this.contributionInfoLoading = false
        })
      }
      return res
    } catch(err) {
      console.log(err)
      this.contributionInfoLoading = false
    }
  }
}