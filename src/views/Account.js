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

  handleContributionsClick() {
    this.setState({contributionsToggle: !this.state.contributionsToggle})
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
          <p>Can't get contribution info...</p>
        }
      } else {
        return <p>Can't get contribution info...</p>
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
      <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
        <p style={{fontSize:"25px"}}>{userInfo.username}</p>
        <div className="px-3">
          <p>First Name: {userInfo.first_name}</p>
          <p>Last Name: {userInfo.last_name}</p>
          <p>Email: {userInfo.email}</p>
          <p>Approved asset count: {userInfo.approved_asset_count}</p>
          <p>Coins: {userInfo.coins}</p>
          <Button variant="link" onClick={() => this.handleContributionsClick()}>
            Contributions: {this.state.contributionsToggle ? "▼" : "▲"}
          </Button>
          <div className="d-flex flex-row flex-wrap">
            {this.state.contributionsToggle ? this.renderContributions(userInfo.contributions) : null}
          </div>
        </div>
        <br />
        {/* {userInfo.admin ? <AdminTools /> : null} */}
      </div>
    )
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
