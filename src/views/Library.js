import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { 
  getTrackAssets, 
  getTrackAssetsByUsername, 
  getUserByUsername 
} from '../config/api'
import downloadFile from '../utils/presignedDownloadFile'
import TrackItem from '../components/TrackItem'
import SearchBar from '../components/SearchBar'
import Packs from '../components/Packs'
import EditSingleItem from '../components/EditSingleItem'
import {
  Spinner,
  Button,
  Dropdown
} from 'react-bootstrap'
import {
  setQuery,
  getQuery,
  setTrackLimit,
  getTrackLimit,
  setOffset,
  getOffset,
  setFilter,
  getFilter
} from '../utils/searchParams'

const Library = inject('userStore')(observer((props) => {
  const history = useHistory()
  const pageParams = useParams()
  const [view, setView] = useState('tracks')
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [tracksURLs, setTracksURLs] = useState([])
  const [trackCount, setTrackCount] = useState(0)
  const [aboutToggle, setAboutToggle] = useState(false)
  const [about, setAbout] = useState()
  const [userByUsernameInfo, setUserByUsernameInfo] = useState(null)
  
  useEffect(() => {
    void async function init() {
      await props.userStore.getUserInfo()
      await props.userStore.getUsersList()
      if(!props.profile && view === 'tracks') {
        handleGetTracks()
      }
      if(props.profile) {
        if(props.userStore.userInfo) setAbout(props.userStore.userInfo.about)
        getUserByUsernameInfo()
        handleGetTracks()
      }
    }()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.profile])
  
  function renderTracksList() {
    if(loadingTracks) {
      return <Spinner animation="border" role="status" />
    }
    if(!loadingTracks && tracksData.length === 0) {
      return <p>No tracks</p>
    }
    if(tracksData.length !== 0) {
      return tracksData.map(track => {
        if(track.active === true) {
          return(
            <div key={track.id}>
              <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query, history, handleGetTracks)} getTracks={() => handleGetTracks()}/>
            </div>
          )
        } else return null
      })
    }
  }

  function handleGetNextTracks() {
    var offsetInt = parseInt(getOffset(history))
    var limitInt = parseInt(getTrackLimit(history))
    setOffset(offsetInt + limitInt, history, handleGetTracks)
  }

  function handleGetPreviousTracks() {
    var offsetInt = parseInt(getOffset(history))
    var limitInt = parseInt(getTrackLimit(history))
    setOffset(offsetInt - limitInt, history, handleGetTracks)
  }
  
  function renderPaginationButtons() {
    return(
      <div className='py-3 text-center align-items-center'>
        <div className="d-flex flex-row justify-content-between">
          <Button disabled={parseInt(getOffset(history)) === 0} variant='link' onClick={() => handleGetPreviousTracks()}>Previous</Button>
          <Button disabled={trackCount < parseInt(getTrackLimit(history))} variant='link' onClick={() => handleGetNextTracks()}>Next</Button>
        </div>
      </div>
    )
  }

  function renderSelectFilter() {
    return(
      <Dropdown onSelect={(e) => {setFilter(e, history, handleGetTracks) }}>
        <Dropdown.Toggle
          variant="outline-secondary"
        >
          {getFilter(history) ? getFilter(history) : 'Filter'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey={null}>None</Dropdown.Item>
          <Dropdown.Item eventKey="popular">popular</Dropdown.Item>
          <Dropdown.Item eventKey="weapons">weapons</Dropdown.Item>
          <Dropdown.Item eventKey="magic">magic</Dropdown.Item>
          <Dropdown.Item eventKey="creatures">creatures</Dropdown.Item>
          <Dropdown.Item eventKey="foley">foley</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  function renderSelectTrackLimit() {
    return(
      <Dropdown onSelect={(e) => {setTrackLimit(e, history, handleGetTracks) }}>
        <Dropdown.Toggle
          variant="outline-secondary"
        >
          {getTrackLimit(history)}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="10">10</Dropdown.Item>
          <Dropdown.Item eventKey="20">20</Dropdown.Item>
          <Dropdown.Item eventKey="30">30</Dropdown.Item>
          <Dropdown.Item eventKey="50">50</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  function renderPacksOrTracksView() {
    if(view === 'packs') {
      return <Packs />
    } else {
      return(
        <div>
          <h4 className="pt-3">Tracks</h4>
          <hr className='mt-1'/>
          <div className='p-1 d-flex flex-row justify-content-between'>
            <div className='d-flex flex-row align-items-baseline'>
              {renderSelectFilter()}  
              {
                getQuery(history) ?
                <div className='ml-2 d-flex flex-row align-items-baseline'>
                  <p>{`+ ${getQuery(history)}`}</p>
                  <Button variant="link" onClick={() => setQuery(null, history, handleGetTracks)}>Remove</Button>
                </div> : null
              }
            </div>
            {renderSelectTrackLimit()}
          </div>
          {renderTracksList()}
          {renderPaginationButtons()}
        </div>
      )
    }
  }

  async function getUserByUsernameInfo() {
    const res = await getUserByUsername(pageParams.username)
    setUserByUsernameInfo(res.data)
  }

  function handleEditAbout({params}) {
    params.user_id = props.userStore.userInfo.id
    props.userStore.editUserInfo(params)
    setAboutToggle(false)
  }

  function renderAbout() {
    const {userInfo} = props.userStore
    if(userInfo && userInfo.username === pageParams.username) {
      return(
        <p className='pl-3' style={{fontSize: '20px'}}>"{props.userStore.userInfo.about}"</p>
      )
    }
    else if(userByUsernameInfo) {
      return(
        <p className='pl-3' style={{fontSize: '20px'}}>"{userByUsernameInfo.about}"</p>
      )
    }
  }

  async function handleGetTracks() {
    setLoadingTracks(true)
    const params = {
      offset: parseInt(getOffset(history)),
      limit: parseInt(getTrackLimit(history)) ? parseInt(getTrackLimit(history)) : 30
    }
    if(getQuery(history)) {
      params.query = getQuery(history)
    }
    if(getFilter(history)) {
      params.filter = getFilter(history)
    }
    try {
      let res;
      if(props.profile) res = await getTrackAssetsByUsername(pageParams.username, params)
      else res = await getTrackAssets(params)
      
      if(res.status === 200) {
        const newTracksURLs = []
        await Promise.all(
          res.data.tracks.map(async asset => {
            const assetName = asset.name
            const assetUUID = asset.uuid
            const objectName = `tracks/${assetUUID}.wav`
            const presignedURL = await downloadFile({objectName, downloadName: assetName})
            newTracksURLs.push({uuid: assetUUID, name: assetName, url: presignedURL})
          })
        )
        setTracksURLs(newTracksURLs)
        setTracksData(res.data.tracks)
        setLoadingTracks(false)
        setTrackCount(parseInt(res.data.track_count))
      } else throw new Error()
    } catch(err) {
      setLoadingTracks(false)
      console.log(err)
    }
  }

  if(props.profile) {
    const {userInfo} = props.userStore
    return (
      <div>
        <div className='d-flex flex-row'>
          <h4 className='mr-5'>{pageParams.username}</h4>
          <SearchBar setQuery={(query) => setQuery(query, history, handleGetTracks)}/>
        </div>
        <div>
          <div className="d-flex flex-row align-items-baseline">
            <p>About:</p>
            {userInfo && userInfo.username === pageParams.username ? <Button variant="link" onClick={() => setAboutToggle(!aboutToggle)}>{aboutToggle ? "Edit -" : "Edit +"}</Button> : null}
          </div>
          {
            aboutToggle ? 
            EditSingleItem({
              typeOfEdit: 'about',
              toggle: 'about',
              inputType: 'textarea',
              handleEdit: (data) => handleEditAbout(data),
              item: about, setItem: setAbout}) 
            : renderAbout()
          }
        </div>
        <hr className='mt-1'/>
          <div className='p-1 d-flex flex-row justify-content-between'>
            <div className='d-flex flex-row align-items-baseline'>
              {renderSelectFilter()}  
              {
                getQuery(history) ?
                <div className='ml-2 d-flex flex-row align-items-baseline'>
                  <p>{`+ ${getQuery(history)}`}</p>
                  <Button variant="link" onClick={() => setQuery(null, history, handleGetTracks)}>Remove</Button>
                </div> : null
              }
            </div>
            {renderSelectTrackLimit()}
          </div>
          {renderTracksList()}
          {renderPaginationButtons()}
      </div>
    )
  } else {
    return (
      <div>
        <div className="border rounded d-flex flex-row px-2 py-1" style={{backgroundColor: '#ebebeb', width: '100%'}}>
          <div className="d-flex flex-row align-items-center mr-5">
            <h5 className="mt-1 mr-5">Library</h5>
            {view === 'tracks' ? <SearchBar setQuery={(query) => setQuery(query, history, handleGetTracks)}/> : null}
          </div>
          <div>
            <Button variant="link" onClick={() => setView('packs')}>Packs</Button>
            <Button variant="link" onClick={() => setView('tracks')}>Tracks</Button>
          </div>
        </div>
        {renderPacksOrTracksView()}
      </div>
    )
  }
  
}))

export default Library