import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import {Spinner, Button} from 'react-bootstrap'
import moment from 'moment'
import {BiCoin} from 'react-icons/bi'
import UploadTrack from '../components/UploadTrack'
import { Link } from 'react-router-dom'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contributionsToggle: false,
      uploadTrackBoolean: false
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

    if(this.props.projectsStore.projectsLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!this.props.projectsStore.projects) {
      return <p>Can't get projects...</p>
    }

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
              <div className="p-3 m-1 border rounded card-style" style={{backgroundColor: 'white'}}>
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
          <div className="p-3 m-1 border rounded justify-content-center align-items-center card-style" style={{height: '10vh'}}><p>Project entry removed... </p></div>
        }
      } else {
        return(
          <div className="p-3 m-1 border rounded justify-content-center align-items-center card-style" style={{height: '10vh'}}><p>Project removed... </p></div>
        )
      }
    })
    return contributionsMap
  }

  renderLoadingOrAccount() {

    if(this.props.userStore.userInfoLoading) {
      return(
        <div>
          <Spinner animation="border" role="status" />
        </div>
      )
    }
    if(!this.props.userStore.userInfo) {
      return(
        <div>
          <p>Can't find user data...</p>
        </div>
      )
    }

    const {userInfo} = this.props.userStore
    return(
      <div>
        <h4>Account Info</h4>
        <hr />
        <div>
          <div className='d-flex flex-row align-items-baseline'>
            <h4>{userInfo.username}</h4>
            <Button variant="link" style={{fontSize: '12px'}} as={Link} to={`/profile/${userInfo.username}`}>View Profile</Button>
          </div>
          <div className='px-3'>
            <p>{userInfo.first_name} {userInfo.last_name}</p>
            <p>{userInfo.email}</p>
            <p>Approved asset count - {userInfo.approved_asset_count}</p>
            <p>Coins <BiCoin style={{color: 'orange', fontSize: '20px'}}/> - {userInfo.coins}</p>
          </div>
        </div>
        <h4>Upload to Library</h4>
        <hr />
        <div className="d-flex flex-column justify-content-start align-items-start">
          <Button className="px-3 py-1" variant="link" onClick={() => this.setState({uploadTrackBoolean: !this.state.uploadTrackBoolean})}>
            {this.state.uploadTrackBoolean ? '- Upload New Track' : '+ Upload New Track'}
          </Button>
          {this.state.uploadTrackBoolean ? <UploadTrack authorId={userInfo.id} uploadTrackBoolean={value => this.setState({uploadTrackBoolean: value})}/> : null}
        </div>
        <br />
        <h4>Contributions</h4>
        <hr />
        <div className="d-flex flex-row flex-wrap">
          {this.renderContributions(userInfo.contributions)}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderLoadingOrAccount()}
      </div>
    )
  }
}

export default inject('userStore', 'projectsStore')(observer(Account));
