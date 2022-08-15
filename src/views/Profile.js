import React, { useEffect, useState } from 'react'
import { getTrackAssetsByUsername } from '../config/api'
import downloadFile from '../utils/presignedDownloadFile'
import { Spinner, Button } from 'react-bootstrap'
import TrackItem from '../components/TrackItem'
import { useParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { inject, observer } from 'mobx-react'
import EditSingleItem from '../components/EditSingleItem'
import { getUserByUsername } from '../config/api'
import { useHistory } from 'react-router'

const Profile = inject('userStore')(observer((props) => {
  const history = useHistory()
  const pageParams = useParams()
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [tracksURLs, setTracksURLs] = useState([])
  const [trackCount, setTrackCount] = useState(0)
  const [aboutToggle, setAboutToggle] = useState(false)
  const [about, setAbout] = useState()
  const [userByUsernameInfo, setUserByUsernameInfo] = useState(null)
  const getTrackLimit = 10

  useEffect(() => {
    void async function init() {
      await props.userStore.getUsersList()
      await props.userStore.getUserInfo()
      if(props.userStore.userInfo) setAbout(props.userStore.userInfo.about)
      getUserByUsernameInfo()
      getTracksByUser()
    }()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function serializeSearch(type, newParam) {
    const params = new URLSearchParams({})

    if(type === 'query' && newParam !== '') {
      params.append('query', newParam)
    } 
    else if(type === 'offset') {
      const query = getQuery()
      if(query !== '') params.append('query', query)
      if(newParam !== 0) params.append('offset', newParam)
    }

    const paramsAsString = params.toString()
    history.push({
      pathname: `/profile/${pageParams.username}`,
      search: paramsAsString
    })
  }

  function setQuery(query) {
    serializeSearch('query', query)
    getTracksByUser()
  }

  function getQuery() {
    const {query} = new Proxy(new URLSearchParams(history.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });  
    if(query) {
      return query
    } else return ''
  }

  function setOffset(offset) {
    serializeSearch('offset', offset)
    getTracksByUser()
  }

  function getOffset() {
    const {offset} = new Proxy(new URLSearchParams(history.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });  
    if(offset) {
      return offset
    } else return 0
  }
  
  async function getUserByUsernameInfo() {
    const res = await getUserByUsername(pageParams.username)
    setUserByUsernameInfo(res.data)
  }

  async function getTracksByUser() {
    setLoadingTracks(true)
    const params = {
      offset: parseInt(getOffset()),
      limit: getTrackLimit
    }
    if(getQuery() !== '') {
      params.query = getQuery()
    }
    try {
      const res = await getTrackAssetsByUsername(pageParams.username, params)
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
        setTrackCount(res.data.track_count)
      } else throw new Error()
    } catch(err) {
      setLoadingTracks(false)
      console.log(err)
    }
  }

  function handleEditAbout({params}) {
    params.user_id = props.userStore.userInfo.id
    props.userStore.editUserInfo(params)
    setAboutToggle(false)
  }

  function handleGetNextTracks() {
    setOffset(getOffset() + getTrackLimit)
  }

  function handleGetPreviousTracks() {
    setOffset(getOffset() - getTrackLimit)
  }

  function renderPaginationButtons() {
    return(
      <div className='py-3 text-center align-items-center'>
        <div className="d-flex flex-row justify-content-between">
          <Button disabled={getOffset() === 0} variant='link' onClick={() => handleGetPreviousTracks()}>Previous</Button>
          <Button disabled={(getOffset() + getTrackLimit) >= trackCount} variant='link' onClick={() => handleGetNextTracks()}>Next</Button>
        </div>
      </div>
    )
  }

  function renderTracksList() {
    if(loadingTracks) {
      return <Spinner animation="border" role="status" />
    }
    if(!loadingTracks && tracksData.length === 0) {
      return null
    }
    if(tracksData.length !== 0) {
      return tracksData.map(track => {
        return(
          <div key={track.id}>
            <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)} getTracks={() => getTracksByUser()}/>
          </div>
        )
      })
    }
  }

  function renderAbout() {
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

  const {userInfo} = props.userStore
    return (
      <div>
        <div className='d-flex flex-row'>
          <h4 className='mr-5'>{pageParams.username}</h4>
          <SearchBar setQuery={(query) => setQuery(query)}/>
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
          <div className='d-flex flex-row align-items-baseline'>
            {
              getQuery() !== '' ?
              <div className='ml-2 d-flex flex-row align-items-baseline'>
                <p>{`+ ${getQuery()}`}</p>
                <Button variant="link" onClick={() => setQuery('')}>Remove</Button>
              </div> : null
            }
          </div>
        <p className='d-flex flex-row justify-content-end'>Results: {trackCount}</p>
        {renderTracksList()}
        {renderPaginationButtons()}
      </div>
    )
}))

export default Profile
