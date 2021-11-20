import { observable, makeObservable, action, toJS } from 'mobx';
import {
  getProjects as getProjectsAPICall,
  getProject as getProjectAPICall
} from '../../config/api'

export default class ProjectsStore {
  constructor() {
    this.projects = null
    this.projectInfo = null

    makeObservable(this, {
      projects: observable,
      projectInfo: observable,
      getProjects: action,
      getProjectInfo: action
    })
  }

  async getProjects() {
    try {
      const res = await getProjectsAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.projects = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }

  async getProjectInfo(projectId) {
    try {
      const res = await getProjectAPICall(projectId)
      if(res.status === 200) {
        const data = toJS(res.data)
        this.projectInfo = data
      }
      return res
    } catch(err) {
      console.log(err)
    }
  }
}