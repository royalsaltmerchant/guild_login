import { observable, makeObservable, action, toJS } from 'mobx';
import {
  getProjects as getProjectsAPICall,
  getProject as getProjectAPICall
} from '../../config/api'

export default class ProjectsStore {
  constructor() {
    this.projects = null
    this.projectInfo = null
    this.projectsLoading = false
    this.projectInfoLoading = false

    makeObservable(this, {
      projects: observable,
      projectInfo: observable,
      projectsLoading: observable,
      projectInfoLoading: observable,
      getProjects: action,
      getProjectInfo: action
    })
  }

  async getProjects() {
    this.projectsLoading = true
    try {
      const res = await getProjectsAPICall()
      if(res.status === 200) {
        const data = toJS(res.data)
        this.projects = data
        this.projectsLoading = false
      }
      return res
    } catch(err) {
      console.log(err)
      this.projectsLoading = false
    }
  }

  async getProjectInfo(projectId) {
    this.projectInfoLoading = true
    try {
      const res = await getProjectAPICall(projectId)
      if(res.status === 200) {
        const data = toJS(res.data)
        this.projectInfo = data
        this.projectInfoLoading = false
      }
      return res
    } catch(err) {
      console.log(err)
      this.projectInfoLoading = false
    }
  }
}