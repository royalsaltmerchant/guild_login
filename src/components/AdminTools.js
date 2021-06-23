import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import CreateProject from './CreateProject'
import CreateEntry from './CreateEntry'
import {Spinner, Button, Form} from 'react-bootstrap'
import {
  editProject as editProjectAPICall,
  deleteProject as deleteProjectAPICall
} from '../config/api'

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
  
  async getAndUpdateProjects() {
    this.setState({loadingProjects: true}, async () => {
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
        this.setState({
          hasProjects: false,
          loadingProjects: false
        })
      }
    })
  }

  handleProjectClick(projectToggleKey, projectEditKey) {
    this.setState({
      [projectToggleKey]: !this.state[projectToggleKey],
      [projectEditKey]: false
    })
  }

  handleEntryClick(entryToggleKey) {
    this.setState({
      [entryToggleKey]: !this.state[entryToggleKey]
    })
  }

  handleEditProjectClick(projectEditKey) {
    this.setState({
      [projectEditKey]: !this.state[projectEditKey]
    })
  }

  async handleEditProjectSave(event, projectId, projectEditKey) {
    event.preventDefault()
    const title = event.target.form[`project${projectId}Title`].value || event.target.form[`project${projectId}Title`].placeholder
    const description = event.target.form[`project${projectId}Description`].value || event.target.form[`project${projectId}Description`].placeholder
    const active = event.target.form[`project${projectId}Active`].checked
    const complete = event.target.form[`project${projectId}Complete`].checked

    try {
      const res = await editProjectAPICall(projectId, title, description, active, complete)
      if(res.status === 200) {
        this.setState({[projectEditKey]: false})
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleDeleteProject(projectId) {
    try {
      const res = await deleteProjectAPICall(projectId)
      if(res.status === 200) {
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
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
      const entryToggleKey = `entry${entry.id}Toggle`
      return(
        <div key={entry.id} className="px-3">
          <Button variant="link" onClick={() => this.handleEntryClick(entryToggleKey)}>
            {entry.title} ▼
          </Button>
            {
              this.state[entryToggleKey] ?
              <div>
                <p>{entry.amount}</p>
                <p>{entry.description}</p>
                <p>Complete: {entry.complete ? 'true' : 'false'}</p>
                <p>Contributions:</p>
                {this.renderEntryContributions(entry.contributions)}
              </div> : null
            }
        </div>
      )
    })
    return entriesMap
  }

  renderProjectsToggleOrEdit(projectToggleKey, projectEditKey, project) {
    if(this.state[projectToggleKey] && !this.state[projectEditKey]) {
      return(
        <div className="px-3">
          <p>{project.description}</p>
          <p>{project.image_file}</p>
          <p>Active: {project.active ? 'true' : 'false'}</p>
          <p>Complete: {project.complete ? 'true' : 'false'}</p>
          <p>Entries:</p>
          <p>{this.renderProjectEntries(project.entries)}</p>
          <Button variant="link" onClick={() => this.setState({createEntryBoolean: !this.state.createEntryBoolean})}>
            {this.state.createEntryBoolean ? '- Create New Entry' : '+ Create New Entry'}
          </Button>
          {this.state.createEntryBoolean ? <CreateEntry projectId={project.id} getAndUpdateProjects={() => this.getAndUpdateProjects()} createEntryBoolean={value => this.setState({createEntryBoolean: value})}/> : null}
        </div>
      )
    }
    if(this.state[projectToggleKey] && this.state[projectEditKey]) {
      return(
        <Form className="px-3" onSubmit={(event) => this.handleSubmitEditProject(event, project.id)}>
          <Form.Group controlId={`project${project.id}Title`}>
            <Form.Label>Title</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={project.title} />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              size="md"
              type="text"
              placeholder={project.description} />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Active`}>
            <Form.Label>Active</Form.Label>
            <Form.Check 
              size="md"
              type="switch"
              defaultChecked={project.active ? true : false}
            />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Complete`}>
            <Form.Label>Complete</Form.Label>
            <Form.Check
              size="md"
              type="switch"
              defaultChecked={project.complete ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditProjectSave(event, project.id, projectEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[projectEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteProject(project.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderProjects() {
    const {projects} = this.props.projectsStore
    const {hasProjects, loadingProjects} = this.state
    if(hasProjects && !loadingProjects) {
      const projectMap = projects.map(project => {
        const projectToggleKey = `project${project.id}Toggle`
        const projectEditKey = `project${project.id}Edit`
        return(
          <div key={project.id} className="px-3 py-1">
            <div className="d-flex justify-content-between">
            <Button variant="link" onClick={() => this.handleProjectClick(projectToggleKey, projectEditKey)}>
              {project.title} ▼
            </Button>
            <Button variant="link" disabled={!this.state[projectToggleKey]} onClick={() => this.handleEditProjectClick(projectEditKey)}>
              Edit
            </Button>
            </div>
            {this.renderProjectsToggleOrEdit(projectToggleKey, projectEditKey, project)}
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
      <div className="border w-100 p-3 rounded">
        <p style={{fontSize:"20px"}}>Admin Tools</p>
        <Button variant="link" onClick={() => this.setState({createProjectBoolean: !this.state.createProjectBoolean})}>
          {this.state.createProjectBoolean ? '- Create New Project' : '+ Create New Project'}
        </Button>
        {this.state.createProjectBoolean ? <CreateProject getAndUpdateProjects={() => this.getAndUpdateProjects()} createProjectBoolean={value => this.setState({createProjectBoolean: value})}/> : null}
        <hr />
        <p style={{fontSize:"20px"}}>Projects:</p>
        {this.renderProjects()}
      </div>
    )
  }
}

export default inject('projectsStore')(observer(AdminTools));
