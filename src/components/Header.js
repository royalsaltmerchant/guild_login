import React, { Component } from 'react'
import {Media} from 'react-bootstrap'
import sfag from '../assets/sfag.png'

export default class Header extends Component {
  render() {
    return (
      <div className="p-2 d-flex flex-column align-items-center">
        <Media>
          <a href="https://sfaudioguild.com">
          <img
            src={sfag}
            width={80}
            height={80}
          />
          </a>
        </Media>
      </div>
    )
  }
}
