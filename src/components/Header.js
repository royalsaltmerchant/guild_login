import React, { Component } from 'react'
import {Media} from 'react-bootstrap'
import sfag from '../assets/sfag.png'

export default class Header extends Component {
  render() {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Media>
          <a href="https://sfaudioguild.com">
          <img
            width={100}
            height={100}
            src={sfag}
          />
          </a>
        </Media>
        <hr style={{width: '75%'}}/>
      </div>
    )
  }
}
