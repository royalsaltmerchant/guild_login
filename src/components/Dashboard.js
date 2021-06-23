import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Spinner, Button } from 'react-bootstrap'
import {withRouter, Link} from 'react-router-dom'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasProjects: false,
      loadingProjects: true
    }
  }

  componentDidMount() {
    this.getAndUpdateProjects()
  }

  async getAndUpdateProjects() {
    this.setState({loadingProjects: true}, async () => {
      try {
        const res = await this.props.projectsStore.getProjects()
        if(res.status === 200) {
          this.setState({
            hasProjects: true,
            loadingProjects: false
          })
        }
      } catch(err) {
        console.log(err)
        this.setState({
          hasProjects: false,
          loadingProjects: false
        })
      }
    })
  }

  renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => (
      <div key={entry.id} className="px-5 flex-row">
        <div className="flex-column">
        <div className="d-flex flex-row justify-content-between">
          <p><b>{`(${entry.amount}) ${entry.title}`}</b></p>
          <Link to={`/Upload/entry/${entry.id}`}>
            Contribute
          </Link>
        </div>
        <p className="px-3">{entry.description}</p>
        </div>
      </div>
    ))
    return entriesMap
  }

  renderProjects() {
    const {projects} = this.props.projectsStore
    const {hasProjects, loadingProjects} = this.state

    if(hasProjects && !loadingProjects) {
      const projectsMap = projects.map(project => {
        if(project.active && !project.complete) {
          return(
            <div key={project.id} className="card-style border rounded p-3 m-3 w-75" style={{backgroundColor: '#d6f2ff', color: '#47476b', fontFamily: 'Noto Sans'}}>
              <h4 className="pb-2"><b>{project.title}</b></h4>
              <p className="px-3">{project.description}</p>
              <hr />
              {this.renderProjectEntries(project.entries)}
            </div>
          )
        }
      })
      return projectsMap
    }
    if(!hasProjects && !loadingProjects) {
      return <div>
        <p>Can't Load Projects, Try Again</p>
        <Button onClick={() => this.getAndUpdateProjects()}>Try Again</Button>
      </div>
    }
    if(loadingProjects) {
      return <Spinner />
    }
  }

  render() {
    return (
      <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
        <h3 className="p-3 text-center">Available Projects:</h3>
        {this.renderProjects()}
      </div>
    )
  }
}

export default inject('projectsStore')(observer(withRouter(Dashboard)))