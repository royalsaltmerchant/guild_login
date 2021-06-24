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
          Description: 'Combat sound effects for games set in medieval or fantasy settings. Complete with swings impacts and custom assembled attacks and combos for Swords, Daggers, Axes and more.',
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
        <div className="w-50">
          <h1>{packDetails.title}</h1>
          <div className="px-3">
            <p>"{packDetails.Description}"</p>
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

  renderPackImageAndVideo() {
    const {packName} = this.props.match.params
    if(packName === 'ancient-weapons-pack') {
      return(
        <div className="d-flex flex-column">
          <Image className="pack-img mr-3 mb-5" src={`${config.image_URL}weaponpackcolor.jpg`} />
          <h3 className="text-center">Audio Demo</h3>
          <iframe class="video" src="https://www.youtube.com/embed/gKJfZtoXlkg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      )
    }
    if(packName === 'ancient-magic-pack') {
      return(
        <div className="d-flex flex-column">
          <Image className="pack-img mr-3 mb-5" src={`${config.image_URL}magicpackcolor.jpg`} />
          <h3 className="text-center">Audio Demo</h3>
          <iframe class="video" src="https://www.youtube.com/embed/dBPSmhcLOBA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="d-flex flex-row flex-wrap justify-content-center w-75 p-3 border border-light rounded" style={{backgroundColor: '#fff'}}>
        {this.renderPackImageAndVideo()}
        {this.renderTrackDetails()}
      </div>
    )
  }
}

export default withRouter(PackDetails)