import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import {Spinner, Button, Row, Col} from 'react-bootstrap'
import moment from 'moment'
import {BiCoin} from 'react-icons/bi'
import {GiRoundStar} from 'react-icons/gi'
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
        <div className="d-flex flex-row justify-content-between pt-2">
          <h4 className="align-self-end m-0">Account</h4>
          {userInfo.premium ? null : <Button as={Link} to={'/upgrade'} variant="warning">Upgrade to Premium!</Button>}
        </div>
        <hr className='mt-1'/>
        <div>
          <div className='d-flex flex-row align-items-baseline'>
            <h4>{userInfo.premium ? <GiRoundStar style={{color: 'orange', marginBottom: '7px'}} /> : null}{userInfo.username}</h4>
            <Button variant="link" style={{fontSize: '12px'}} as={Link} to={`/profile/${userInfo.username}`}>View Profile</Button>
          </div>
          <div className='px-3'>
            <p>{userInfo.first_name} {userInfo.last_name}</p>
            <p>{userInfo.email}</p>
            {/* <p>Approved asset count - {userInfo.approved_asset_count}</p> */}
            <p>Coins <BiCoin style={{color: 'orange', fontSize: '20px'}}/> - {userInfo.coins}</p>
            {/* <p>Premium member - {userInfo.premium ? "Yes" : "No"}</p> */}
          </div>
        </div>
        <br />
        <h4>Upload SFX to Library and Profile</h4>
        <small className='m-0 p-0' style={{color: 'green'}}>- If other users buy your tracks with coins, you will receive those coins!</small>
        <br />
        <small className='p-0 m-0' style={{color: 'red'}}>- Members who do not have a premium subscription are limited to 20 free uploads.</small>
        <hr className='mt-1'/>
        <div className="d-flex flex-column justify-content-start align-items-start">
          {!userInfo.premium && userInfo.upload_count >= 20 ? <p style={{color: 'red'}}>You have reached your upload limit, please upgrade to Premium to upload more tracks.</p> : null}
          <Button className="px-3 py-1" onClick={() => this.setState({uploadTrackBoolean: !this.state.uploadTrackBoolean})} disabled={!userInfo.premium && userInfo.upload_count >= 20}>
            {this.state.uploadTrackBoolean ? '- Upload New Track' : '+ Upload New Track'}
          </Button>
          {this.state.uploadTrackBoolean ? <UploadTrack upload_count={userInfo.upload_count} premium={userInfo.premium} authorId={userInfo.id} uploadTrackBoolean={value => this.setState({uploadTrackBoolean: value})}/> : null}
        </div>
        <br />
        <h4>Contributions to SF Audio Guild Projects</h4>
        <small style={{color: 'green'}}>- By contributing to our projects, you can earn 10 coins if your sound is approved!</small>
        <hr className='mt-1'/>
        <div className="d-flex flex-row flex-wrap">
          {
            userInfo.contributions && userInfo.contributions.length !== 0 ? 
            this.renderContributions(userInfo.contributions) : 
            <div>
              <p>You have not made any contributions yet</p>
              <Button variant="warning" as={Link} to={'/dashboard'}>Start Contributing</Button>
            </div>
          }
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
