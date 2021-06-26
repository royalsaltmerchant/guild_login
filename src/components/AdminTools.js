import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import CreateProject from './CreateProject'
import CreateEntry from './CreateEntry'
import {Spinner, Button, Form, Image} from 'react-bootstrap'
import {
  editProject as editProjectAPICall,
  deleteProject as deleteProjectAPICall,
  editEntry as editEntryAPICall,
  deleteEntry as deleteEntryAPICall,
  editContribution as editContributionAPICall,
  deleteContribution as deleteContributionAPICall,
  editUser as editUserAPICall
} from '../config/api'
import {finalConfig as config} from '../config/config'

class AdminTools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createProjectBoolean: false,
      createEntryBoolean: false,
      loadingProjects: true,
      loadingEntries: true,
      loadingUsers: true,
      hasProjects: false,
      hasEntries: false,
      hasUsersList: false
    }
  }
  
  componentDidMount() {
    this.getAndUpdateProjects()
    this.getAndUpdateUsersList()
  }

  async getAndUpdateUsersList() {
    this.setState({loadingUsers: true}, async () => {
      try {
        const res = await this.props.userStore.getUsersList()
        if(res.status === 200) {
          this.setState({
            hasUsersList: true,
            loadingUsers: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasUsersList: false,
          loadingUsers: false
        })
      }
    })
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

  handleEntryClick(entryToggleKey, entryEditKey) {
    this.setState({
      [entryToggleKey]: !this.state[entryToggleKey],
      [entryEditKey]: false
    })
  }

  handleContributionClick(contributionToggleKey, contributionEditKey) {
    this.setState({
      [contributionToggleKey]: !this.state[contributionToggleKey],
      [contributionEditKey]: false
    })
  }

  handleUserClick(userToggleKey, userEditKey) {
    this.setState({
      [userToggleKey]: !this.state[userToggleKey],
      [userEditKey]: false
    })
  }

  handleEditProjectClick(projectEditKey) {
    this.setState({
      [projectEditKey]: !this.state[projectEditKey]
    })
  }

  handleEditEntryClick(entryEditKey) {
    this.setState({
      [entryEditKey]: !this.state[entryEditKey]
    })
  }

  handleEditContributionClick(contributionEditKey) {
    this.setState({
      [contributionEditKey]: !this.state[contributionEditKey]
    })
  }

  handleEditUserClick(userEditKey) {
    this.setState({
      [userEditKey]: !this.state[userEditKey]
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

  async handleEditEntrySave(event, entryId, entryEditKey) {
    event.preventDefault()
    const amount = event.target.form[`entry${entryId}Amount`].value || event.target.form[`entry${entryId}Amount`].placeholder
    const title = event.target.form[`entry${entryId}Title`].value || event.target.form[`entry${entryId}Title`].placeholder
    const description = event.target.form[`entry${entryId}Description`].value || event.target.form[`entry${entryId}Description`].placeholder
    const complete = event.target.form[`entry${entryId}Complete`].checked

    try {
      const res = await editEntryAPICall(entryId, amount, title, description, complete)
      if(res.status === 200) {
        this.setState({[entryEditKey]: false})
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleEditContributionSave(event, contributionId, contributionEditKey) {
    event.preventDefault()
    const amount = event.target.form[`contribution${contributionId}Amount`].value || event.target.form[`contribution${contributionId}Amount`].placeholder
    const status = event.target.form[`contribution${contributionId}Status`].value || event.target.form[`contribution${contributionId}Status`].placeholder
    
    try {
      const res = await editContributionAPICall(contributionId, amount, status)
      if(res.status === 200) {
        this.setState({[contributionEditKey]: false})
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleEditUserSave(event, userId, userEditKey) {
    event.preventDefault()
    const approvedAssetCount = event.target.form[`user${userId}ApprovedAssetCount`].value || event.target.form[`user${userId}ApprovedAssetCount`].placeholder
    const eligible = event.target.form[`user${userId}Eligible`].checked
    
    try {
      const res = await editUserAPICall(userId, approvedAssetCount, eligible)
      if(res.status === 200) {
        this.setState({[userEditKey]: false})
        this.getAndUpdateUsersList()
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

  async handleDeleteEntry(entryId) {
    try {
      const res = await deleteEntryAPICall(entryId)
      if(res.status === 200) {
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleDeleteContribution(contributionId) {
    try {
      const res = await deleteContributionAPICall(contributionId)
      if(res.status === 200) {
        this.getAndUpdateProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  renderContributionsToggleOrEdit(contributionToggleKey, contributionEditKey, contribution) {
    if(this.state[contributionToggleKey] && !this.state[contributionEditKey]) {
      return(
        <div className="px-3">
          <p>Amount: {contribution.amount}</p>
          <p>Status: {contribution.status}</p>
        </div>
      )
    }
    if(this.state[contributionToggleKey] && this.state[contributionEditKey]) {
      return(
        <Form className="px-3">
          <Form.Group controlId={`contribution${contribution.id}Amount`}>
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={contribution.amount}
            />
          </Form.Group>
          <Form.Group controlId={`contribution${contribution.id}Status`}>
            <Form.Label>Status</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={contribution.status}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditContributionSave(event, contribution.id, contributionEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[contributionEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteContribution(contribution.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderEntryContributions(contributions) {
    const {hasUsersList, loadingUsers} = this.state
    const {usersList} = this.props.userStore
    if(hasUsersList && !loadingUsers) {
      const contributionsMap = contributions.map(contribution => {
        const user = usersList.filter(user => {
          return user.id === contribution.user_id
        })
        if(user.length !== 0) {
          const firstUser = user[0]
          const contributionToggleKey = `contribution${contribution.id}Toggle`
          const contributionEditKey = `contribution${contribution.id}Edit`
          return(
            <div key={contribution.id} className="px-3">
              <Button variant="link" onClick={() => this.handleContributionClick(contributionToggleKey, contributionEditKey)}>
                {`${firstUser.first_name} ${firstUser.last_name} (${firstUser.username})`} {this.state[contributionToggleKey] ? "▼" : "▲"}
              </Button>
              <Button variant="link" disabled={!this.state[contributionToggleKey]} onClick={() => this.handleEditContributionClick(contributionEditKey)}>
                  Edit
              </Button>
              {this.renderContributionsToggleOrEdit(contributionToggleKey, contributionEditKey, contribution)}
              <hr />
            </div>
          )
        } else {
          return <p>Can't find user...</p>
        }
      })
      return contributionsMap
    } else {
      return <p>No User Data!</p>
    }
  }

  renderEntriesToggleOrEdit(entryToggleKey, entryEditKey, entry) {
    if(this.state[entryToggleKey] && !this.state[entryEditKey]) {
      return(
        <div className="px-3">
          <p>Amount: {entry.amount}</p>
          <p>Description: {entry.description}</p>
          <p>Complete: {entry.complete ? 'true' : 'false'}</p>
          <p>Contributions:</p>
          {this.renderEntryContributions(entry.contributions)}
        </div> 
      )
    }
    if(this.state[entryToggleKey] && this.state[entryEditKey]) {
      return(
        <Form className="px-3">
          <Form.Group controlId={`entry${entry.id}Amount`}>
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={entry.amount}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Title`}>
            <Form.Label>Title</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={entry.title}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              size="md"
              type="text"
              placeholder={entry.description}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Complete`}>
            <Form.Label>Complete</Form.Label>
            <Form.Check
              size="md"
              type="switch"
              defaultChecked={entry.complete ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditEntrySave(event, entry.id, entryEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[entryEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteEntry(entry.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => {
      const entryToggleKey = `entry${entry.id}Toggle`
      const entryEditKey = `entry${entry.id}Edit`
      return(
        <div key={entry.id} className="px-3">
          <div className="d-flex justify-content-between">
            <Button variant="link" onClick={() => this.handleEntryClick(entryToggleKey, entryEditKey)}>
              {entry.title} {this.state[entryToggleKey] ? "▼" : "▲"}
            </Button>
            <Button variant="link" disabled={!this.state[entryToggleKey]} onClick={() => this.handleEditEntryClick(entryEditKey)}>
                Edit
            </Button>
          </div>
          {this.renderEntriesToggleOrEdit(entryToggleKey, entryEditKey, entry)}
        </div>
      )
    })
    return entriesMap
  }

  renderProjectsToggleOrEdit(projectToggleKey, projectEditKey, project) {
    if(this.state[projectToggleKey] && !this.state[projectEditKey]) {
      return(
        <div className="px-3">
          <p>Description: {project.description}</p>
          <Image className="small-img" src={`${config.image_URL}${project.image_file}`} rounded />
          <p>Active: {project.active ? 'true' : 'false'}</p>
          <p>Complete: {project.complete ? 'true' : 'false'}</p>
          <p>Entries:</p>
          {this.renderProjectEntries(project.entries)}
          <Button className="px-3 py-3" variant="link" onClick={() => this.setState({createEntryBoolean: !this.state.createEntryBoolean})}>
            {this.state.createEntryBoolean ? '- Create New Entry' : '+ Create New Entry'}
          </Button>
          {this.state.createEntryBoolean ? <CreateEntry projectId={project.id} getAndUpdateProjects={() => this.getAndUpdateProjects()} createEntryBoolean={value => this.setState({createEntryBoolean: value})}/> : null}
        </div>
      )
    }
    if(this.state[projectToggleKey] && this.state[projectEditKey]) {
      return(
        <Form className="px-3">
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
                {project.title} {this.state[projectToggleKey] ? "▼" : "▲"}
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

  renderUserToggleOrEdit(userToggleKey, userEditKey, user) {
    if(this.state[userToggleKey] && !this.state[userEditKey]) {
      return(
        <div key={user.id} className="px-3 py-1">
          <div className="px-3">
            <p>- Approved Asset Count: {user.approved_asset_count}</p>
            <p>- Eligible-Status: {user.eligible ? 'true' : 'false'}</p>
          </div>
        </div>
      )
    }
    if(this.state[userToggleKey] && this.state[userEditKey]) {
      return(
        <Form className="px-3">
          <Form.Group controlId={`user${user.id}ApprovedAssetCount`}>
            <Form.Label>Approved Asset Count</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={user.approved_asset_count}
            />
          </Form.Group>
          <Form.Group controlId={`user${user.id}Eligible`}>
            <Form.Label>Eligible</Form.Label>
            <Form.Check
              size="md"
              type="switch"
              defaultChecked={user.eligible ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditUserSave(event, user.id, userEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[userEditKey]: false})}>
              Cancel
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderUsersList() {
    const {usersList} = this.props.userStore
    const {hasUsersList, loadingUsers} = this.state
    if(hasUsersList && !loadingUsers) {
      const usersMap = usersList.map(user => {
        const userToggleKey = `user${user.id}Toggle`
        const userEditKey = `user${user.id}Edit`
        return(
          <div className="px-3 py-1">
            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={() => this.handleUserClick(userToggleKey, userEditKey)}>
                {`${user.first_name} ${user.last_name} (${user.username}) ${user.email}`} {this.state[userToggleKey] ? "▼" : "▲"}
              </Button>
              <Button variant="link" disabled={!this.state[userToggleKey]} onClick={() => this.handleEditUserClick(userEditKey)}>
                Edit
              </Button>
            </div>
            {this.renderUserToggleOrEdit(userToggleKey, userEditKey, user)}
          </div>
        )
      })
      return usersMap
    }
    if(!hasUsersList && !loadingUsers) {
      return <p>Can't get users list!</p>
    }
    if(loadingUsers) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div className="border w-100 p-3 rounded">
        <p style={{fontSize:"20px"}}>Admin Tools</p>
        <Button className="px-3 py-1" variant="link" onClick={() => this.setState({createProjectBoolean: !this.state.createProjectBoolean})}>
          {this.state.createProjectBoolean ? '- Create New Project' : '+ Create New Project'}
        </Button>
        {this.state.createProjectBoolean ? <CreateProject getAndUpdateProjects={() => this.getAndUpdateProjects()} createProjectBoolean={value => this.setState({createProjectBoolean: value})}/> : null}
        <hr />
        <p style={{fontSize:"20px"}}>Projects:</p>
        {this.renderProjects()}
        <hr />
        <p style={{fontSize:"20px"}}>Users:</p>
        {this.renderUsersList()}
      </div>
    )
  }
}

export default inject('projectsStore', 'userStore')(observer(AdminTools));
