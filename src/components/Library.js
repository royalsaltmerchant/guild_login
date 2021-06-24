import React, { Component } from 'react'
import { Image } from 'react-bootstrap'
import {finalConfig as config} from '../config/config'
import {withRouter, Link} from 'react-router-dom'


class Library extends Component {

  renderSFXPacks() {
    return(
      <div>
        <div className="img-div p-3 m-3">
          <Image className="pack-img" src={`${config.image_URL}weaponpackcolor.jpg`} />
          <button className="di-btn" onClick={() => this.props.history.push("/pack/ancient-weapons-pack")}>
            Details
          </button>
        </div>
        <div className="img-div p-3 m-3">
          <Image className="pack-img" src={`${config.image_URL}magicpackcolor.jpg`} />
          <button className="di-btn" onClick={() => this.props.history.push("/pack/ancient-magic-pack")}>
            Details
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
        <h3 className="p-3 text-center">Available Finished SFX Packs:</h3>
        {this.renderSFXPacks()}
      </div>
    )
  }
}

export default withRouter(Library)
