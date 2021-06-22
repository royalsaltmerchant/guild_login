import React, { Component } from 'react'
import CreateProject from './CreateProject'
import CreateEntry from './CreateEntry'
import {Spinner, Button} from 'react-bootstrap'

export default class AdminTools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createProjectBoolean: false
    }
  }

  render() {
    return (
      <div>
        <p><u>Admin Tools</u></p>
        <Button variant="link" onClick={() => this.setState({createProjectBoolean: !this.state.createProjectBoolean})}>
          {this.state.createProjectBoolean ? '- Create New Project' : '+ Create New Project'}
        </Button>
        {this.state.createProjectBoolean ? <CreateProject /> : null}
      </div>
    )
  }
}
