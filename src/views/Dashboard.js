import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Spinner, Button, Image } from 'react-bootstrap'
import {finalConfig as config} from '../config/config'
import { Link } from 'react-router-dom'

const Dashboard = inject('userStore', 'projectsStore')(observer((props) => {

  useEffect(async () => {
    await props.projectsStore.getProjects()
    props.userStore.getUsersList()
    props.userStore.getUserInfo()
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
          <div key={contribution.id} className="px-5 d-flex flex-row justify-content-between align-items-baseline flex-wrap">
            <p style={{color: 'purple'}}>{singleContributionUser.username} - <b>{contribution.amount}</b></p>
            <p style={{color: 'green'}}>{contribution.status}</p>
            {props.userStore.userInfo && props.userStore.userInfo.admin ? <Button as={Link} variant="outline-secondary" to={`/Manage/${contribution.id}`}>Manage</Button> : null}
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
      <div key={entry.id} className="p-3 flex-row border rounded my-3">
        <div className="flex-column">
        <div className="d-flex flex-row justify-content-between align-items-baseline flex-wrap">
          <p><b>{`${entry.title}`}</b></p>
          <p>How many: <b>{entry.amount}</b></p>
          { props.userStore.userInfo && props.userStore.userInfo.contributor ?
            <>
              {entry.complete ? <p style={{color: 'green'}}>Complete</p> : <Button as={Link} variant="warning" to={`/Contribute/entry/${entry.id}`}>
                Contribute
              </Button>}
            </> : null
          }
        </div>
        <p className="px-1">"{entry.description}"</p>
        <p className="px-3"><u>Contributions</u></p>
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
          <div key={project.id} className="p-3 mb-5 card-style border rounded" style={{backgroundColor: 'white', fontFamily: 'Noto Sans', maxWidth: '800px'}}>
            <div className="d-flex flex-row align-items-baseline flex-wrap">
              <Image className="small-img pr-3" src={`${config.projectImageURL}${project.image_file}`} rounded />
              <h5><b>{project.title}</b></h5>
              <p className="pl-3" style={{color: 'purple'}}>{project.complete ? 'Completed' : 'In-Progress'}</p>
            </div>
            <hr style={{marginTop: "-15px"}} />
            <div className="py-3">
              <p className="px-3"><u>About</u></p>
              <p className="px-3"> "{project.description}"</p>
            </div>
            {renderProjectEntries(project.entries)}
          </div>
        )
      }
    }).reverse()
    return projectsMap
  }

  return (
    <div>
      {renderProjects()}
    </div>
  )
}))

export default Dashboard