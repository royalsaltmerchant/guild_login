import { observable, makeObservable, action, toJS } from 'mobx';
import React, { Component } from 'react'
import {getProjects as getProjectsAPICall} from '../../config/api'

export default class ProjectsStore extends Component {
  constructor() {
    super()

    this.projects = null

    makeObservable(this, {
      projects: observable,
      getProjects: action
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
}