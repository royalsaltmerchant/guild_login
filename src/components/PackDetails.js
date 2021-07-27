import React, { Component } from 'react'
import {withRouter, Link} from 'react-router-dom'
import { Image, Button, Spinner } from 'react-bootstrap'
import {finalConfig as config, awsConfig} from '../config/config'
import {getPresignedURL as getPresignedURLAPICall} from '../config/api'
import {inject, observer} from 'mobx-react'
import {authenticate as authenticateAPICall} from '../config/api'

class PackDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      hasUserInfo: false,
      hasPackInfo: false,
      loadingUser: true,
      loadingPack: true,
      userEligible: false
    }
    this.downloadButtonRef = React.createRef()
  }

  componentDidMount() {
    this.authenticate()
    this.getAndUpdatePack()
    const {packName} = this.props.match.params
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

  async authenticate() {
    try {
      const res = await authenticateAPICall()
      if(res.status === 200) {
        this.setState({
          authenticated: true,
          loadingUser: false
        })
      }
    } catch(err) {
      console.log(err)
      this.setState({
        loadingUser: false
      })
    }
  }

  async getAndUpdatePack() {
    this.setState({loadingPack: true}, async () => {
      const {packName} = this.props.match.params
      const packTitleSpaces = packName.replaceAll('-', ' ')
      const packTitle = packTitleSpaces.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
      try {
        const res = await this.props.packsStore.getPackInfo(packTitle)
        if(res.status === 200) {
          this.setState({
            hasPackInfo: true,
            loadingPack: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasPackInfo: false,
          loadingPack: false
        })
      }
    })
  }

  async handleDownload() {
    const {packName} = this.props.match.params
    const bucketName = awsConfig.bucketName
    const objectName = `packs/${packName}/${packName}.zip`

    try {
      const res = await getPresignedURLAPICall(bucketName, objectName)
      if(res.status === 200) {
        const downloadLink = res.data
        this.setState({
          uri: downloadLink
        }, () => this.downloadButtonRef.current.click())
      }
    } catch(err) {
      alert('Something went wrong, please try again.')
    }
  }

  renderAssetTypes(assetTypes) {
    if(assetTypes) {
      const assetTypesMap = assetTypes.map(assetType => (
        <li key={assetType.id} className="px-3">{assetType.description}</li>
    ))
    return <ul>{assetTypesMap}</ul>
    }
  }

  renderPackDetails() {
    const {hasPackInfo, loadingPack} = this.state
    const {packName} = this.props.match.params

    if(hasPackInfo && !loadingPack) {
      const {packInfo} = this.props.packsStore
      
      return(
        <div className="d-flex flex-row">
          <div className="d-flex flex-column">
            <Image className="pack-img mr-3 mb-5" src={`${config.packImageURL}${packInfo.image_file}`} />
            <h3 className="text-center">Audio Demo</h3>
            <iframe className="video" src={packInfo.video_file} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className="w-50">
            <h1>{packInfo.title}</h1>
            <div className="px-3">
              <p>"{packInfo.description}"</p>
              <p>Asset Types:</p>
              {this.renderAssetTypes(packInfo.asset_types)}
            </div>
            <div className="my-5 d-flex flex-column justify-content-center align-items-center">
              {/* <Button as={'a'} href={`${config.s3_base_URL}packs/${packName}`} download>Download</Button> */}
              {this.state.hasUserInfo ? 
                <div>
                  <Button disabled={!this.props.userStore.userInfo.eligible} ref={this.downloadButtonRef} onClick={() => this.handleDownload()}>Download</Button>
                  <a ref={this.downloadButtonRef} href={this.state.uri} />
                </div>: <Spinner />}
            </div>
          </div>
        </div>
      )
    }
    if(!hasPackInfo && !loadingPack) {
      return <p>Can't get pack details</p>
    }
    if(loadingPack) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div className="d-flex flex-row flex-wrap justify-content-center w-75 p-3 border border-light rounded" style={{backgroundColor: '#fff'}}>
        {this.renderPackDetails()}
      </div>
    )
  }
}

export default inject('userStore', 'packsStore')(observer(withRouter(PackDetails)));