import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import {Spinner, Button} from 'react-bootstrap'
import AdminTools from './AdminTools'
import moment from 'moment'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contributionsToggle: false
    }
  }

  async componentDidMount() {
    await this.props.userStore.getUserInfo()
    this.props.projectsStore.getProjects()
  }

  handleContributedAssetsClick(contributedAssetsToggleKey) {
    this.setState({[contributedAssetsToggleKey]: !this.state[contributedAssetsToggleKey]})
  }

  renderContributedAssets(contributedAssets) {
    const contributedAssetMap = contributedAssets.map(asset => {
      return(
        <div className="px-3">
          <p>{asset.name}</p>
        </div>
      )
    })
    return contributedAssetMap
  }

  renderContributions(contributions) {
    const {projects} = this.props.projectsStore
    const contributionsReverse = contributions.slice().reverse()
    const contributionsMap = contributionsReverse.map(contribution => {
      const date = moment(contribution.date_created).format("MMM Do YYYY")
      const contributionProject = projects.filter(project => project.id === contribution.project_id)
      if(contributionProject.length !== 0) {
        const project = contributionProject[0]
        const contributionProjectEntry = project.entries.filter(entry => entry.id === contribution.entry_id)
        if(contributionProjectEntry.length !== 0) {
          const entry = contributionProjectEntry[0]
          const contributedAssetsToggleKey = `contributedAsset${contribution.id}Toggle`
          return(
            <div>
              <div className="p-3 m-1 border rounded">
                <p>Created: {date}</p>
                <p>Project: {project.title}</p>
                <p>Entry: {entry.title}</p>
                <p>Amount: {contribution.amount}</p>
                <p>Status: {contribution.status}</p>
                <Button variant="link" onClick={() => this.handleContributedAssetsClick(contributedAssetsToggleKey)}>
                  Assets: {this.state[contributedAssetsToggleKey] ? "▼" : "▲"}
                </Button>
                {this.state[contributedAssetsToggleKey] ? this.renderContributedAssets(contribution.contributed_assets) : null}
              </div>
              <br />
            </div>
          )
        } else {
          <div className="p-3 m-1 border rounded justify-content-center align-items-center" style={{height: '10vh'}}><p>Project entry removed... </p></div>
        }
      } else {
        return(
          <div className="p-3 m-1 border rounded justify-content-center align-items-center" style={{height: '10vh'}}><p>Project removed... </p></div>
        )
      }
    })
    return contributionsMap
  }

  renderLoadingOrAccount() {

    if(this.props.userStore.userInfoLoading) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
          <Spinner animation="border" role="status" />
        </div>
      )
    }
    if(!this.props.userStore.userInfo) {
      return(
        <div className="d-flex justify-content-center align-items-center" style={{width: '75vw', backgroundColor: '#fff'}}>
          <p>Can't find user data...</p>
        </div>
      )
    }

    const {userInfo} = this.props.userStore
    return(
      <div className="d-flex flex-column justify-content-center align-items-center p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
        <div className="px-3">
          <div className="d-flex flex-row justify-content-between border rounded p-3">
            <div className="d-flex flex-column">
              <h4>{userInfo.username}</h4>
              <p>{userInfo.first_name} {userInfo.last_name}</p>
              <p>{userInfo.email}</p>
            </div>
            <div className="d-flex flex-column">
              <p><u>Approved asset count</u></p>
              <p><b>{userInfo.approved_asset_count}</b></p>
            </div>
            <div className="d-flex flex-column">
              <p><u>Coins</u></p>
              <p><b>{userInfo.coins}</b></p>
            </div>
          </div>
          <br />
          <br />
          <div className="text-center">
            <h4>Contributions</h4>
            <hr />
            <div className="d-flex flex-row flex-wrap justify-content-center">
              {this.renderContributions(userInfo.contributions)}
            </div>
          </div>
        </div>
        <br />
        {userInfo.admin ? <AdminTools /> : null}
      </div>
    )
  }

  render() {
    return (
      <div>
        <h2 className="pb-3 text-center">Account Info</h2>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}

export default inject('userStore', 'projectsStore')(observer(Account));
