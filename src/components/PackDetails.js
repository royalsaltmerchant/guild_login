import React, { Component } from 'react'
import {withRouter, Link} from 'react-router-dom'
import { Image } from 'react-bootstrap'
import {finalConfig as config} from '../config/config'

class PackDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      packDetails: {},
      assetTypes: []
    }
  }

  componentDidMount() {
    const {packName} = this.props.match.params

    if(packName === 'ancient-weapons-pack') {
      this.setState({
        packDetails: {
          title: 'Ancient Weapons Pack',
          Description: 'its got wonderful amazing sounds',
        },
        assetTypes: ['one', 'two', 'three', 'four']
      })
    }
    if(packName === 'ancient-magic-pack') {
      this.setState({
        packDetails: {
          title: 'Ancient Magic Pack',
          Description: 'its got wonderful amazing sounds',
        },
        assetTypes: ['one', 'two', 'three', 'four']
      })
    }
  }

  renderAssetTypes() {
    const {assetTypes} = this.state

    const trackMap = assetTypes.map(track => (
        <li className="px-3">{track}</li>
    ))
    return <ul>{trackMap}</ul>
  }

  renderTrackDetails() {
    const {packDetails, assetTypes} = this.state
    if(packDetails !== {} && assetTypes.length !== 0) {
      return(
        <div>
          <h1>{packDetails.title}</h1>
          <div className="px-3">
            <p>Description: "{packDetails.Description}"</p>
            <p>Asset Types:</p>
            {this.renderAssetTypes()}
          </div>
        </div>
      )
    } else {
      return(
        <p>no details</p>
      )
    }
  }

  render() {
    return (
      <div className="d-flex flex-row flex-wrap">
        <Image className="pack-img mr-3" src={`${config.image_URL}weaponpackcolor.jpg`} />
        {this.renderTrackDetails()}
      </div>
    )
  }
}

export default withRouter(PackDetails)