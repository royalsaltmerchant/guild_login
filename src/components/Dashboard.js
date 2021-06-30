import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Spinner, Button, Image } from 'react-bootstrap'
import {withRouter, Link} from 'react-router-dom'
import {finalConfig as config} from '../config/config'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasProjects: false,
      hasUsers: false,
      loadingProjects: true,
      loadingUsers: true
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

  renderEntryContributions(contributions) {
    const {hasUsersList, loadingUsers} = this.state
    const {usersList} = this.props.userStore
    if(hasUsersList && !loadingUsers) {
      const contributionsMap = contributions.map(contribution => {
        const contributionUser = usersList.filter(user => {
          return user.id === contribution.user_id
        })
        const singleContributionUser = contributionUser[0]
        if(singleContributionUser) {
          return(
            <div key={contribution.id} className="px-5 d-flex flex-row justify-content-between w-75">
            <p style={{color: 'purple'}}>{`(${contribution.amount}) ${singleContributionUser.username}`}</p>
            <p style={{color: 'green'}}>{contribution.status}</p>
          </div>
          )
        } else {
          return <p>Can't find contributing user...</p>
        }
      })
      return contributionsMap
    }
    if(!hasUsersList && !loadingUsers) {
      return <p style={{color: 'red'}}>Can't get users!</p>
    }
    if(loadingUsers) {
      return <Spinner />
    }
  }

  renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => (
      <div key={entry.id} className="p-3 flex-row border rounded my-3" style={{backgroundColor: '#fff'}}>
        <div className="flex-column">
        <div className="d-flex flex-row justify-content-between">
          <p><b>{`(${entry.amount}) ${entry.title}`}</b></p>
          {entry.complete ? <p style={{color: 'green'}}>Complete</p> : <Button as={Link} variant="outline-success" to={`/Upload/entry/${entry.id}`}>
            Contribute
          </Button>}
        </div>
        <p className="px-3">{entry.description}</p>
        <p className="px-3">Contributions:</p>
        {this.renderEntryContributions(entry.contributions)}
        </div>
      </div>
    ))
    return entriesMap
  }

  renderProjects() {
    const {projects} = this.props.projectsStore
    const {hasProjects, loadingProjects} = this.state

    if(hasProjects && !loadingProjects) {
      const projectsMap = projects.map(project => {
        if(project.active && !project.complete) {
          return(
            <div key={project.id} className="card-style border rounded p-3 m-3 w-75" style={{color: '#0066cc', backgroundColor: '#ebf0fa', fontFamily: 'Noto Sans'}}>
              <div className="d-flex flex-row align-items-baseline">
                <Image className="small-img pr-3" src={`${config.projectImageURL}${project.image_file}`} rounded />
                <h2><b>{project.title}</b></h2>
                <p className="pl-3" style={{color: 'purple'}}>{project.complete ? 'Completed' : 'In-Progress'}</p>
              </div>
              <hr style={{marginTop: "-15px"}} />
              <div className="py-3">
                <h4 className="px-3">{project.description}</h4>
              </div>
              {this.renderProjectEntries(project.entries)}
            </div>
          )
        }
      }).reverse()
      return projectsMap
    }
    if(!hasProjects && !loadingProjects) {
      return <div>
        <p>Can't Load Projects, Try Again</p>
        <Button onClick={() => this.getAndUpdateProjects()}>Try Again</Button>
      </div>
    }
    if(loadingProjects) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
        <h3 className="p-3 text-center">Available Projects:</h3>
        {this.renderProjects()}
      </div>
    )
  }
}

export default inject('projectsStore', 'userStore')(observer(withRouter(Dashboard)))