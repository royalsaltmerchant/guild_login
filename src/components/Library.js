import React, { Component } from 'react'
import { Image } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import {finalConfig as config} from '../config/config'
import {withRouter, Link} from 'react-router-dom'
import { Spinner } from 'react-bootstrap'


class Library extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingPacks: true,
      hasPacks: false
    }
  }

  componentDidMount() {
    this.getAndUpdatePacks()
  }

  async getAndUpdatePacks() {
    this.setState({loadingPacks: true}, async () => {
      try {
        const res = await this.props.packsStore.getPacks()
        if(res.status === 200) {
          this.setState({
            loadingPacks: false,
            hasPacks: true
          })
        } else {
          this.setState({
            loadingPacks: false,
            hasPacks: false
          })
        }
      } catch(err) {
        this.setState({
          loadingPacks: false,
          hasPacks: false
        })
        console.log(err)
      }
    })
  }

  renderSFXPacks() {
    const {packs} = this.props.packsStore
    const {hasPacks, loadingPacks} = this.state
    console.log(packs)
    if(hasPacks, !loadingPacks) {
      const packMap = packs.map(pack => {
        return(
          <div className="img-div p-3 m-3">
            <Image className="pack-img" src={`${config.packImageURL}${pack.image_file}`} />
            <button className="di-btn" onClick={() => this.props.history.push("/pack/ancient-weapons-pack")}>
              Details
            </button>
          </div>
        )    
      })
      return packMap
    }
    if(!hasPacks, !loadingPacks) {
      return(
        <p>Can't get packs!</p>
      )
    }
    if(loadingPacks) {
      return(
        <Spinner />
      )
    }
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

export default inject('packsStore')(observer(Library));
