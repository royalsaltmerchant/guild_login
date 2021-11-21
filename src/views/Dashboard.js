import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Spinner, Button, Image } from 'react-bootstrap'
import {finalConfig as config} from '../config/config'
import { Link } from 'react-router-dom'

const Dashboard = inject('userStore', 'projectsStore')(observer((props) => {

  useEffect(async () => {
    await props.projectsStore.getProjects()
    props.userStore.getUsersList()
  },[])
    
  function renderEntryContributions(contributions) {
    if(props.userStore.usersListLoading) {
      return <Spinner animation="border" role="status" />
    }
    if(!props.userStore.usersList) {
      return <p style={{color: 'red'}}>Can't get users!</p>
    }
    const {usersList} = props.userStore
    const contributionsMap = contributions.map(contribution => {
      const contributionUser = usersList.filter(user => {
        return user.id === contribution.user_id
      })
      const singleContributionUser = contributionUser[0]
      if(singleContributionUser) {
        return(
          <div key={contribution.id} className="px-5 d-flex flex-row justify-content-between w-75">
          <p style={{color: 'purple'}}>{`(${contribution.amount}) ${singleContributionUser.username}`}</p>
          <p style={{color: 'green'}}>{contribution.status}</p>
        </div>
        )
      } else {
        return <p>Can't find contributing user...</p>
      }
    })
    return contributionsMap
  }

  function renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => (
      <div key={entry.id} className="p-3 flex-row border rounded my-3" style={{backgroundColor: '#fff'}}>
        <div className="flex-column">
        <div className="d-flex flex-row justify-content-between">
          <p><b>{`(${entry.amount}) ${entry.title}`}</b></p>
          {entry.complete ? <p style={{color: 'green'}}>Complete</p> : <Button as={Link} variant="outline-success" to={`/Upload/entry/${entry.id}`}>
            Contribute
          </Button>}
        </div>
        <p className="px-3">{entry.description}</p>
        <p className="px-3">Contributions:</p>
        {renderEntryContributions(entry.contributions)}
        </div>
      </div>
    ))
    return entriesMap
  }
  
  function renderProjects() {

    if(props.projectsStore.projectsLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!props.projectsStore.projects) {
      return <p>Can't Load Projects...</p>
    }

    const {projects} = props.projectsStore
    const projectsMap = projects.map(project => {
      if(project.active && !project.complete) {
        return(
          <div key={project.id} className="card-style border rounded p-3 m-3 w-75" style={{color: '#0066cc', backgroundColor: '#ebf0fa', fontFamily: 'Noto Sans'}}>
            <div className="d-flex flex-row align-items-baseline">
              <Image className="small-img pr-3" src={`${config.projectImageURL}${project.image_file}`} rounded />
              <h2><b>{project.title}</b></h2>
              <p className="pl-3" style={{color: 'purple'}}>{project.complete ? 'Completed' : 'In-Progress'}</p>
            </div>
            <hr style={{marginTop: "-15px"}} />
            <div className="py-3">
              <h4 className="px-3">{project.description}</h4>
            </div>
            {renderProjectEntries(project.entries)}
          </div>
        )
      }
    }).reverse()
    return projectsMap
  }

  return (
    <div className="d-flex flex-column justify-content-start align-items-start p-3 rounded" style={{width: '75vw', backgroundColor: '#fff'}}>
      <h3 className="p-3 text-center">Available Projects:</h3>
      {renderProjects()}
    </div>
  )
}))

export default Dashboard