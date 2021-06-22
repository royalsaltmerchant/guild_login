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
      createEntryBoolean: false,
      loadingProjects: true,
      loadingEntries: true,
      hasProjects: false,
      hasEntries: false
    }
  }

  componentDidMount() {
    this.getAndUpdateProjects()
  }

  handleProjectClick(projectKey) {
    this.setState({
      [projectKey]: !this.state[projectKey]
    })
  }

  handleEntryClick(entryKey) {
    this.setState({
      [entryKey]: !this.state[entryKey]
    })
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

  renderEntryContributions(contributions) {
    return contributions.map(contribution => (
      <div className="px-3">
        <p>User_ID {contribution.user_id}</p>
        <p>{contribution.amount}</p>
        <p>{contribution.status}</p>
      </div>
    ))
  }

  renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => {
      const entryKey = `entry${entry.id}Toggle`
      return(
        <div key={entry.id} className="px-3">
          <Button variant="link" onClick={() => this.handleEntryClick(entryKey)}>
            {entry.title} ▼
          </Button>
            {
              this.state[entryKey] ?
              <div>
                <p>{entry.amount}</p>
                <p>{entry.description}</p>
                <p>Complete: {entry.complete ? 'yes' : 'no'}</p>
                <p>Contributions:</p>
                {this.renderEntryContributions(entry.contributions)}
              </div> : null
            }
        </div>
      )
    })
    return entriesMap
  }

  renderProjects() {
    const {projects} = this.props.projectsStore
    const {hasProjects, loadingProjects} = this.state
    if(hasProjects && !loadingProjects) {
      const projectMap = projects.map(project => {
        const projectKey = `project${project.id}Toggle`
        return(
          <div key={project.id} className="px-3">
            <Button variant="link" onClick={() => this.handleProjectClick(projectKey)}>
              {project.title} ▼
            </Button>
            {
              this.state[projectKey] ? 
              <div className="px-3">
              <p>{project.description}</p>
              <p>{project.image_file}</p>
              <p>Active: {project.active ? 'yes' : 'no'}</p>
              <p>Complete: {project.complete ? 'yes' : 'no'}</p>
              <p>Entries:</p>
              <p>{this.renderProjectEntries(project.entries)}</p>
              <Button variant="link" onClick={() => this.setState({createEntryBoolean: !this.state.createEntryBoolean})}>
                {this.state.createEntryBoolean ? '- Create New Entry' : '+ Create New Entry'}
              </Button>
              {this.state.createEntryBoolean ? <CreateEntry projectId={project.id}/> : null}
            </div> : null
            }
          </div>
        )
      })
      return projectMap
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
