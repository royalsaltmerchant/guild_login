import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {
  getProjects as getProjectsAPICall,
  getProject as getProjectAPICall
} from '../../config/api'

export default class ProjectsStore extends Component {
  constructor() {
    super()

    this.projects = null
    this.projectInfo = null

    makeObservable(this, {
      projects: observable,
      projectInfo: observable,
      getProjects: action,
      getProject: action
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

  async getProject() {
    try {
      const res = await getProjectAPICall()
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