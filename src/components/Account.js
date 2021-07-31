import React, { Component } from 'react'
import {authenticate as authenticateAPICall} from '../config/api'
import {inject, observer} from 'mobx-react'
import {Spinner, Button} from 'react-bootstrap'
import AdminTools from './AdminTools'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      loadingAuth: true,
      hasUserInfo: false,
      hasProjects: false,
      loadingProjects: true
    }
  }

  componentDidMount() {
    this.authenticate()
    this.getAndUpdateProjects()
  }

  async componentDidUpdate() {
    const {authenticated, hasUserInfo} = this.state
    if(authenticated && !hasUserInfo) {
      try {
        const res = await this.props.userStore.getUserInfo()
        if(res.status === 200) {
          this.setState({hasUserInfo: true})
        }
      } catch(err) {
        console.log(err)
      }
    }
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
        } else {
          this.setState({
            hasProjects: false,
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

  async authenticate() {
    try {
      const res = await authenticateAPICall()
      if(res.status === 200) {
        this.setState({
          authenticated: true,
          loadingAuth: false
        })
      }
    } catch(err) {
      console.log(err)
      this.setState({
        loadingAuth: false
      })
    }
  }

  renderContributions(contributions) {
    const {hasProjects, loadingProjects} = this.state
    if(hasProjects && !loadingProjects) {
      const {projects} = this.props.projectsStore
      const contributionsMap = contributions.map(contribution => {
        const contributionProject = projects.filter(project => project.id === contribution.project_id)
        if(contributionProject.length !== 0) {
          const project = contributionProject[0]
          const contributionProjectEntry = project.entries.filter(entry => entry.id === contribution.entry_id)
          if(contributionProjectEntry.length !== 0) {
            const entry = contributionProjectEntry[0]
            return(
              <div>
                <div className="px-3">
                  <p>Project: {project.title}</p>
                  <p>Entry: {entry.title}</p>
                  <p>Amount: {contribution.amount}</p>
                  <p>Status: {contribution.status}</p>
                </div>
                <br />
              </div>
            )
          } else {
            <p>Can't get contribution info...</p>
          }
        } else {
          return <p>Can't get contribution info...</p>
        }
      })
      return contributionsMap
    }
    if(!hasProjects && !loadingProjects) {
      return <p>Can't get contribution info...</p>
    }
    if(loadingProjects) {
      return <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
        </Spinner>
    }
  }

  renderLoadingOrAccount() {
    const {loadingAuth, authenticated, hasUserInfo} = this.state
    if(!loadingAuth && authenticated && hasUserInfo) {
      const {userInfo} = this.props.userStore
      return(
        <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
          <p style={{fontSize:"25px"}}>{userInfo.username}</p>
          <div className="px-3">
            <p>First Name: {userInfo.first_name}</p>
            <p>Last Name: {userInfo.last_name}</p>
            <p>Email: {userInfo.email}</p>
            <p>Eligible to access community files: {userInfo.eligible ? 'yes' : 'no'}</p>
            <p>Approved asset count: {userInfo.approved_asset_count}</p>
            <p>Coins: {userInfo.coins}</p>
            <p>Contributions:</p>
            {this.renderContributions(userInfo.contributions)}
          </div>
          <br />
          {userInfo.admin ? <AdminTools hasProjects={this.state.hasProjects} loadingProjects={this.state.loadingProjects}/> : null}
        </div>
      )
    }
    if(loadingAuth) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }
    if(!loadingAuth && !authenticated) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
          <p>Can't find user data...</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h2 className="pb-3 text-center">Account</h2>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}

export default inject('userStore', 'projectsStore')(observer(Account));
