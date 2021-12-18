import React, { Component } from 'react'
import {inject, observer} from 'mobx-react'
import CreateProject from '../components/CreateProject'
import CreateEntry from '../components/CreateEntry'
import CreatePack from '../components/CreatePack'
import CreateAssetType from '../components/CreateAssetType'
import UploadTrack from '../components/UploadTrack'
import {Spinner, Button, Form, Image} from 'react-bootstrap'
import {
  editProject as editProjectAPICall,
  deleteProject as deleteProjectAPICall,
  editEntry as editEntryAPICall,
  deleteEntry as deleteEntryAPICall,
  editUser as editUserAPICall,
  editPack as editPackAPICall,
  deletePack as deletePackAPICall,
  editAssetType as editAssetTypeAPICall,
  deleteAssetType as deleteAssetTypeAPICall
} from '../config/api'
import {finalConfig as config} from '../config/config'
import S3 from 'react-aws-s3'
import {awsConfig} from '../config/config'

class AdminTools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createProjectBoolean: false,
      createEntryBoolean: false,
      createPackBoolean: false,
      createAssetTypeBoolean: false,
      uploadTrackBoolean: false
    }
  }
  
  componentDidMount() {
    this.props.userStore.getUsersList()
    this.props.packsStore.getPacks()
    this.props.projectsStore.getProjects()
  }

  handleToggleClick(toggleKey, editKey) {
    this.setState({
      [toggleKey]: !this.state[toggleKey],
      [editKey]: false
    })
  }

  handleEditClick(editKey) {
    this.setState({
      [editKey]: !this.state[editKey]
    })
  }


  async handleEditProjectSave(event, project, projectEditKey) {
    event.preventDefault()

    const title = event.target.form[`project${project.id}Title`].value
    const description = event.target.form[`project${project.id}Description`].value 
    const image = event.target.form[`project${project.id}Image`].files[0] ? event.target.form[`project${project.id}Image`].files[0].name : null
    const imageFile = event.target.form[`project${project.id}Image`].files[0]
    const active = event.target.form[`project${project.id}Active`].checked
    const complete = event.target.form[`project${project.id}Complete`].checked

    const params =  {
      project_id: project.id
    }
    if(title !== '' && title !== ' ') {
      params.title = title
    }
    if(description !== '' && description !== ' ') {
      params.description = description
    }
    if(image !== null) {
      params.image_file = image
    }
    if(project.active !== active) {
      params.active = active
    }
    if(project.complete !== complete) {
      params.complete = complete
    }

    const paramsSize = Object.keys(params).length

    if(paramsSize > 1) {
      try {
        const res = await editProjectAPICall(params)
        if(res.status === 200) {
          this.setState({[projectEditKey]: false})
          this.props.projectsStore.getProjects()
          if(imageFile) {
            this.uploadImageFile(imageFile, "project_images")
          }
        } else throw new Error
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({[projectEditKey]: false})
    }
  }

  async handleEditEntrySave(event, entry, entryEditKey) {
    event.preventDefault()
    
    const amount = event.target.form[`entry${entry.id}Amount`].value 
    const title = event.target.form[`entry${entry.id}Title`].value 
    const description = event.target.form[`entry${entry.id}Description`].value
    const complete = event.target.form[`entry${entry.id}Complete`].checked

    const params = {
      entry_id: entry.id
    }
    if(amount !== '' && amount !== ' ') {
      params.amount = amount
    }
    if(title !== '' && title !== ' ') {
      params.title = title
    }
    if(entry.complete !== complete) {
      params.complete = complete
    }
    const paramsSize = Object.keys(params).length

    if(paramsSize > 1) {
      try {
        const res = await editEntryAPICall(params)
        if(res.status === 200) {
          this.setState({[entryEditKey]: false})
          this.props.projectsStore.getProjects()
        } else throw new Error
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({[entryEditKey]: false})
    }

  }

  async handleEditUserSave(event, userId, userEditKey) {
    event.preventDefault()

    const approvedAssetCount = Number(event.target.form[`user${userId}ApprovedAssetCount`].value)
    const coins = Number(event.target.form[`user${userId}Coins`].value)
    const params = {
      user_id: userId
    }
    if(approvedAssetCount !== '' && approvedAssetCount !== ' ') {
      params.approved_asset_count = approvedAssetCount
    }
    if(coins !== '' && coins !== ' ') {
      params.coins = coins
    }
    const paramsSize = Object.keys(params).length

    if(paramsSize > 1) {
      try {
        const res = await editUserAPICall(params)
        if(res.status === 200) {
          this.setState({[userEditKey]: false})
          this.props.userStore.getUsersList()
        } else throw new Error
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({[userEditKey]: false})
    }
  }

  async handleEditPackSave(event, pack, packEditKey) {
    event.preventDefault()

    const title = event.target.form[`pack${pack.id}Title`].value
    const description = event.target.form[`pack${pack.id}Description`].value
    const image = event.target.form[`pack${pack.id}Image`].files[0] ? event.target.form[`pack${pack.id}Image`].files[0].name : null
    const imageFile = event.target.form[`pack${pack.id}Image`].files[0]
    const video = event.target.form[`pack${pack.id}Video`].value.trim()
    const coinCost = event.target.form[`pack${pack.id}CoinCost`].value
    const active = event.target.form[`pack${pack.id}Active`].checked

    const params =  {
      pack_id: pack.id
    }
    if(title !== '' && title !== ' ') {
      params.title = title.replaceAll(' ', '-').toLowerCase()
    }
    if(description !== '' && description !== ' ') {
      params.description = description
    }
    if(image !== null) {
      params.image_file = image
    }
    if(video !== '' && video !== ' ') {
      params.video_file = video
    }
    if(coinCost !== '' && coinCost !== ' ') {
      params.coin_cost = coinCost
    }
    if(pack.active !== active) {
      params.active = active
    }
    const paramsSize = Object.keys(params).length

    if(paramsSize > 1) {
      try {
        const res = await editPackAPICall(params)
        if(res.status === 200) {
          this.setState({[packEditKey]: false})
          this.props.packsStore.getPacks()
          if(imageFile) {
            this.uploadImageFile(imageFile, "pack_images")
          }
        } else throw new Error
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({[packEditKey]: false})
    }

  }

  async handleEditAssetTypeSave(event, assetTypeId, assetTypeEditKey) {
    event.preventDefault()

    const description = event.target.form[`assetType${assetTypeId}Description`].value

    const params =  {
      asset_type_id: assetTypeId
    }
    if(description !== '' && description !== ' ') {
      params.description = description
    }
    const paramsSize = Object.keys(params).length

    if(paramsSize > 1) {
      try {
        const res = await editAssetTypeAPICall(params)
        if(res.status === 200) {
          this.setState({[assetTypeEditKey]: false})
          this.props.packsStore.getPacks()
        } else throw new Error
      } catch(err) {
        console.log(err)
      }
    } else {
      this.setState({[assetTypeEditKey]: false})
    }

  }

  async handleDeleteProject(projectId) {
    try {
      const res = await deleteProjectAPICall(projectId)
      if(res.status === 200) {
        this.props.projectsStore.getProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleDeleteEntry(entryId) {
    try {
      const res = await deleteEntryAPICall(entryId)
      if(res.status === 200) {
        this.props.projectsStore.getProjects()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleDeletePack(packId) {
    try {
      const res = await deletePackAPICall(packId)
      if(res.status === 200) {
        this.props.packsStore.getPacks()
      }
    } catch(err) {
      console.log(err)
    }
  }

  async handleDeleteAssetType(assetTypeId) {
    try {
      const res = await deleteAssetTypeAPICall(assetTypeId)
      if(res.status === 200) {
        this.props.packsStore.getPacks()
      }
    } catch(err) {
      console.log(err)
    }
  }

  renderEntriesToggleOrEdit(entryToggleKey, entryEditKey, entry) {
    if(this.state[entryToggleKey] && !this.state[entryEditKey]) {
      return(
        <div className="px-5">
          <p>Amount: {entry.amount}</p>
          <p>Description: {entry.description}</p>
          <p>Complete: {entry.complete ? 'true' : 'false'}</p>
        </div> 
      )
    }
    if(this.state[entryToggleKey] && this.state[entryEditKey]) {
      return(
        <Form className="p-3 card-style border rounded">
          <Form.Group controlId={`entry${entry.id}Amount`}>
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={entry.amount}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Title`}>
            <Form.Label>Title</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={entry.title}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              size="md"
              type="text"
              placeholder={entry.description}
            />
          </Form.Group>
          <Form.Group controlId={`entry${entry.id}Complete`}>
            <Form.Label>Complete</Form.Label>
            <Form.Check
              size="md"
              type="switch"
              defaultChecked={entry.complete ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditEntrySave(event, entry, entryEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[entryEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteEntry(entry.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderProjectEntries(entries) {
    const entriesMap = entries.map(entry => {
      const entryToggleKey = `entry${entry.id}Toggle`
      const entryEditKey = `entry${entry.id}Edit`
      return(
        <div key={entry.id} className="px-3">
          <div className="d-flex justify-content-between">
            <Button variant="link" onClick={() => this.handleToggleClick(entryToggleKey, entryEditKey)}>
              {entry.title} {this.state[entryToggleKey] ? "▼" : "▲"}
            </Button>
            <Button variant="link" disabled={!this.state[entryToggleKey]} onClick={() => this.handleEditClick(entryEditKey)}>
                Edit
            </Button>
          </div>
          {this.renderEntriesToggleOrEdit(entryToggleKey, entryEditKey, entry)}
        </div>
      )
    })
    return entriesMap
  }

  renderProjectsToggleOrEdit(projectToggleKey, projectEditKey, project) {
    if(this.state[projectToggleKey] && !this.state[projectEditKey]) {
      return(
        <div className="px-3">
          <p>Description: {project.description}</p>
          <Image className="small-img" src={`${config.projectImageURL}${project.image_file}`} rounded />
          <p>Active: {project.active ? 'true' : 'false'}</p>
          <p>Complete: {project.complete ? 'true' : 'false'}</p>
          <div>
            <p><b>Entries:</b></p>
            {this.renderProjectEntries(project.entries)}
            <Button className="px-3 py-3" variant="link" onClick={() => this.setState({createEntryBoolean: !this.state.createEntryBoolean})}>
              {this.state.createEntryBoolean ? '- Create New Entry' : '+ Create New Entry'}
            </Button>
            {this.state.createEntryBoolean ? <CreateEntry projectId={project.id} createEntryBoolean={value => this.setState({createEntryBoolean: value})}/> : null}
          </div>
        </div>
      )
    }
    if(this.state[projectToggleKey] && this.state[projectEditKey]) {
      return(
        <Form className="p-3 card-style border rounded">
          <Form.Group controlId={`project${project.id}Title`}>
            <Form.Label>Title</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={project.title} />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              size="md"
              type="text"
              placeholder={project.description} />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Image`}>
            <Form.Label>Image</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="file"
              accept="image/*"
              placeholder={project.image_file}
             />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Active`}>
            <Form.Label>Active</Form.Label>
            <Form.Check 
              size="md"
              type="switch"
              defaultChecked={project.active ? true : false}
            />
          </Form.Group>
          <Form.Group controlId={`project${project.id}Complete`}>
            <Form.Label>Complete</Form.Label>
            <Form.Check
              size="md"
              type="switch"
              defaultChecked={project.complete ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditProjectSave(event, project, projectEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[projectEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteProject(project.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderProjects() {
    if(this.props.projectsStore.projectsLoading) {
      return <Spinner animation="border" role="status" />
    }
    if(!this.props.projectsStore.projects) {
      return <p>Can't get projects!</p>
    }
    const {projects} = this.props.projectsStore
    const projectMap = projects.map(project => {
      const projectToggleKey = `project${project.id}Toggle`
      const projectEditKey = `project${project.id}Edit`
      return(
        <div key={project.id} className="px-3 py-1 border rounded admin-tools-item">
          <div className="d-flex justify-content-between flex-wrap">
            <Button variant="link" onClick={() => this.handleToggleClick(projectToggleKey, projectEditKey)}>
              {project.title} {this.state[projectToggleKey] ? "▼" : "▲"}
            </Button>
            <Button variant="link" disabled={!this.state[projectToggleKey]} onClick={() => this.handleEditClick(projectEditKey)}>
              Edit
            </Button>
          </div>
          {this.renderProjectsToggleOrEdit(projectToggleKey, projectEditKey, project)}
        </div>
      )
    })
    return projectMap
  }

  renderAssetTypesEdit(assetTypeEditKey, assetType) {
    if(this.state[assetTypeEditKey]) {
      return(
        <Form className="p-3 card-style border rounded">
          <Form.Group controlId={`assetType${assetType.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              size="md"
              type="text"
              placeholder={assetType.description} />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditAssetTypeSave(event, assetType.id, assetTypeEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[assetTypeEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeleteAssetType(assetType.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }   
  }

  renderPackAssetTypes(assetTypes) {
    const assetTypesMap = assetTypes.map(assetType => {
      const assetTypeToggleKey = `assetType${assetType.id}Toggle`
      const assetTypeEditKey = `assetType${assetType.id}Edit`
      return(
        <div key={assetType.id} className="px-3">
          <div className="d-flex justify-content-between">
            <p>~ {assetType.description}</p>
            <Button variant="link" onClick={() => this.handleEditClick(assetTypeEditKey)}>
                Edit
            </Button>
          </div>
          {this.renderAssetTypesEdit(assetTypeEditKey, assetType)}
        </div>
      )
    })
    return assetTypesMap
  }

  renderPacksToggleOrEdit(packToggleKey, packEditKey, pack) {
    const packTitleSpaces = pack.title.replaceAll('-', ' ')
    const packTitle = packTitleSpaces.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')

    if(this.state[packToggleKey] && !this.state[packEditKey]) {
      return(
        <div className="px-3">
          <p>Title: {packTitle}</p>
          <p>Description: {pack.description}</p>
          <Image className="small-img" src={`${config.packImageURL}${pack.image_file}`} rounded />
          <br />
          <iframe class="video-sm" src={pack.video_file} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <p>Coin Cost: {pack.coin_cost}</p>
          <p>Active: {pack.active ? 'true' : 'false'}</p>
          <p>Downloads: {pack.downloads}</p>
          <div>
            <p><b>Asset Types:</b></p>
            {this.renderPackAssetTypes(pack.asset_types)}
            <Button className="px-3 py-3" variant="link" onClick={() => this.setState({createAssetTypeBoolean: !this.state.createAssetTypeBoolean})}>
              {this.state.createAssetTypeBoolean ? '- Create New Asset Type' : '+ Create New Asset Type'}
            </Button>
            {this.state.createAssetTypeBoolean ? <CreateAssetType packId={pack.id} createAssetTypeBoolean={value => this.setState({createAssetTypeBoolean: value})}/> : null}
          </div>
        </div>
      )
    }
    if(this.state[packToggleKey] && this.state[packEditKey]) {
      return(
        <Form className="p-3 card-style border rounded">
          <Form.Group controlId={`pack${pack.id}Title`}>
            <Form.Label>Title</Form.Label>
            <small class="ml-2" style={{color: 'green'}}>Title will auto-capitalize first letter of each word</small>
            <Form.Control 
              size="md"
              type="text"
              placeholder={packTitle} />
          </Form.Group>
          <Form.Group controlId={`pack${pack.id}Description`}>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea"
              size="md"
              type="text"
              placeholder={pack.description} />
          </Form.Group>
          <Form.Group controlId={`pack${pack.id}Image`}>
            <Form.Label>Image</Form.Label>
            <Form.Control 
              required
              size="md" 
              type="file"
              accept="image/*"
              placeholder={pack.image_file}
             />
          </Form.Group>
          <Form.Group controlId={`pack${pack.id}Video`}>
            <Form.Label>Video Embed Link</Form.Label>
            <small class="ml-2" style={{color: 'red'}}>The embed url, not the regular url</small>
            <Form.Control 
              required
              size="md"
              type="text"
              placeholder={pack.video_file}
            />
          </Form.Group>
          <Form.Group controlId={`pack${pack.id}CoinCost`}>
            <Form.Label>Coin Cost</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={pack.coin_cost}
            />
          </Form.Group>
          <Form.Group controlId={`pack${pack.id}Active`}>
            <Form.Label>Active</Form.Label>
            <Form.Check 
              size="md"
              type="switch"
              defaultChecked={pack.active ? true : false}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditPackSave(event, pack, packEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[packEditKey]: false})}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={() => this.handleDeletePack(pack.id)}>
              Delete
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderPacks() {
    if(this.props.packsStore.packsLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!this.props.packsStore.packs) {
      return <p>Can't get packs!</p>
    }
    
    const {packs} = this.props.packsStore
    const packMap = packs.map(pack => {
      const packToggleKey = `pack${pack.id}Toggle`
      const packEditKey = `pack${pack.id}Edit`
      const packTitleSpaces = pack.title.replaceAll('-', ' ')
      const packTitle = packTitleSpaces.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
      return(
        <div key={pack.id} className="px-3 py-1 rounded border admin-tools-item">
          <div className="d-flex justify-content-between flex-wrap">
            <Button variant="link" onClick={() => this.handleToggleClick(packToggleKey, packEditKey)}>
              {packTitle} {this.state[packToggleKey] ? "▼" : "▲"}
            </Button>
            <Button variant="link" disabled={!this.state[packToggleKey]} onClick={() => this.handleEditClick(packEditKey)}>
              Edit
            </Button>
          </div>
          {this.renderPacksToggleOrEdit(packToggleKey, packEditKey, pack)}
        </div>
      )
    })
    return packMap
  }

  renderUserToggleOrEdit(userToggleKey, userEditKey, user) {
    if(this.state[userToggleKey] && !this.state[userEditKey]) {
      return(
        <div key={user.id} className="px-3 py-1">
          <div className="px-3">
            <p>- Approved Asset Count: {user.approved_asset_count}</p>
            <p>- Coins: {user.coins}</p>
          </div>
        </div>
      )
    }
    if(this.state[userToggleKey] && this.state[userEditKey]) {
      return(
        <Form className="p-3 card-style border rounded">
          <Form.Group controlId={`user${user.id}ApprovedAssetCount`}>
            <Form.Label>Approved Asset Count</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={user.approved_asset_count}
            />
          </Form.Group>
          <Form.Group controlId={`user${user.id}Coins`}>
            <Form.Label>Coins</Form.Label>
            <Form.Control 
              size="md"
              type="number"
              placeholder={user.coins}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="outline-success" onClick={(event) => this.handleEditUserSave(event, user.id, userEditKey)}>
              Save
            </Button>
            <Button variant="outline-secondary" onClick={() => this.setState({[userEditKey]: false})}>
              Cancel
            </Button>
          </div>
        </Form>
      )
    } else {
      return null
    }
  }

  renderUsersList() {
    if(this.props.userStore.usersListLoading) {
      return <Spinner animation="border" role="status" />
    }
    if(!this.props.userStore.usersList) {
      return <p>Can't get users list!</p>
    }
    const {usersList} = this.props.userStore
    const usersMap = usersList.map(user => {
      const userToggleKey = `user${user.id}Toggle`
      const userEditKey = `user${user.id}Edit`
      if(user.active) {
        return(
          <div className="px-3 py-1 rounded border admin-tools-item">
            <div className="d-flex justify-content-between flex-wrap">
              <Button variant="link" onClick={() => this.handleToggleClick(userToggleKey, userEditKey)}>
                {`${user.first_name} ${user.last_name} (${user.username}) ${user.email}`} {this.state[userToggleKey] ? "▼" : "▲"}
              </Button>
              <Button variant="link" disabled={!this.state[userToggleKey]} onClick={() => this.handleEditClick(userEditKey)}>
                Edit
              </Button>
            </div>
            {this.renderUserToggleOrEdit(userToggleKey, userEditKey, user)}
          </div>
        )
      }
    })
    return usersMap
  }

  async uploadImageFile(imageFile, dirName) {
    const config = {
      bucketName: awsConfig.bucketName,
      dirName: dirName,
      region: awsConfig.region,
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey
    }
    const S3Client = new S3(config)

    try {
      const res = await S3Client.uploadFile(imageFile, imageFile.name)
      if(res.status === 204) {
        console.log('succesful upload to aws')
      } else throw new Error
    } catch(err) {
      console.log('failed to upload image to amazon',err)
    }
  }

  render() {
    return (
      <div>
        <p style={{fontSize:"20px"}}>Create</p>
        <div className="d-flex flex-column justify-content-start align-items-start">
          <Button className="px-3 py-1" variant="link" onClick={() => this.setState({createProjectBoolean: !this.state.createProjectBoolean})}>
            {this.state.createProjectBoolean ? '- Create New Project' : '+ Create New Project'}
          </Button>
          {this.state.createProjectBoolean ? <CreateProject createProjectBoolean={value => this.setState({createProjectBoolean: value})}/> : null}
          <Button className="px-3 py-1" variant="link" onClick={() => this.setState({createPackBoolean: !this.state.createPackBoolean})}>
            {this.state.createPackBoolean ? '- Create New Pack' : '+ Create New Pack'}
          </Button>
          {this.state.createPackBoolean ? <CreatePack createPackBoolean={value => this.setState({createPackBoolean: value})}/> : null}
          <Button className="px-3 py-1" variant="link" onClick={() => this.setState({uploadTrackBoolean: !this.state.uploadTrackBoolean})}>
            {this.state.uploadTrackBoolean ? '- Upload New Track' : '+ Upload New Track'}
          </Button>
          {this.state.uploadTrackBoolean ? <UploadTrack uploadTrackBoolean={value => this.setState({uploadTrackBoolean: value})}/> : null}
        </div>
        <hr />
        <p style={{fontSize:"20px"}}>Projects</p>
        {this.renderProjects()}
        <hr />
        <p style={{fontSize:"20px"}}>Packs</p>
        {this.renderPacks()}
        <hr />
        <p style={{fontSize:"20px"}}>Users</p>
        {this.renderUsersList()}
      </div>
    )
  }
}

export default inject('projectsStore', 'userStore', 'packsStore')(observer(AdminTools));
