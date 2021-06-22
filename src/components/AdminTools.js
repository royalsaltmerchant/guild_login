import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import CreateProject from './CreateProject'
import CreateEntry from './CreateEntry'
import {Spinner, Button} from 'react-bootstrap'

class AdminTools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createProjectBoolean: false,
      loadingProjects: true,
      loadingEntries: true,
      hasProjects: false,
      hasEntries: false
    }
  }

  componentDidMount() {
    this.getAndUpdateProjects()
  }

  async getAndUpdateProjects() {
    try {
      const res = await this.props.projectsStore.getProjects()
      if(res.status === 200) {
        this.setState({
          hasProjects: true,
          loadingProjects: false
        })
      }
    } catch(err) {
      console.log(err)
      // this.setState({loadingProjects: false, hasProjects: false})
    }
  }

  renderProjects() {
    const {projects} = this.props.projectsStore
    const {hasProjects, loadingProjects} = this.state
    if(hasProjects && !loadingProjects) {
      return projects.map(project => (
        <div key={project.id} className="p-3">
          <p><u>{project.title}</u></p>
          <div className="p-3">
            <p>{project.description}</p>
            <p>{project.image_file}</p>
            <p>Active: {project.active ? 'yes' : 'no'}</p>
            <p>Complete: {project.complete ? 'yes' : 'no'}</p>
          </div>
        </div>
      ))
    }
    if(!hasProjects && !loadingProjects) {
      return <p>Can't get projects!</p>
    }
    if(loadingProjects) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div>
        <p style={{fontSize:"20px"}}>Admin Tools</p>
        <Button variant="link" onClick={() => this.setState({createProjectBoolean: !this.state.createProjectBoolean})}>
          {this.state.createProjectBoolean ? '- Create New Project' : '+ Create New Project'}
        </Button>
        {this.state.createProjectBoolean ? <CreateProject /> : null}
        <hr />
        <p style={{fontSize:"20px"}}>Projects:</p>
        {this.renderProjects()}
      </div>
    )
  }
}

export default inject('projectsStore')(observer(AdminTools));
