import React, { useEffect, useState } from 'react'
import { getTrackAssetsByUsername } from '../config/api'
import downloadFiles from '../utils/DownloadFIles'
import { Spinner, Button } from 'react-bootstrap'
import TrackItem from '../components/TrackItem'
import { useParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { inject, observer } from 'mobx-react'
import EditSingleItem from '../components/EditSingleItem'

const Profile = inject('userStore')(observer((props) => {
  const pageParams = useParams()
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState([])
  const [query, setQuery] = useState('')
  const [tracksURLs, setTracksURLs] = useState([])
  const [offset, setOffset] = useState(0)
  const [trackCount, setTrackCount] = useState(0)
  const [aboutToggle, setAboutToggle] = useState(false)
  const [about, setAbout] = useState()
  const getTrackLimit = 10

  useEffect(async () => {
    await props.userStore.getUserInfo()
    setAbout(props.userStore.userInfo.about)
    getTracksByUser()
  },[])

  useEffect(() => {
    getTracksByUser()
  }, [offset])

  useEffect(() => {
    setOffset(0)
    getTracksByUser()
  }, [query])

  async function getTracksByUser() {
    setLoadingTracks(true)
    const params = {
      offset: offset,
      limit: getTrackLimit
    }
    if(query !== "") {
      params.query = query
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
            const presignedURL = await downloadFiles(objectName)
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
    setOffset(offset + getTrackLimit)
  }

  function handleGetPreviousTracks() {
    setOffset(offset - getTrackLimit)
  }

  function renderPaginationButtons() {
    return(
      <div className='py-3 text-center align-items-center'>
        <div className="d-flex flex-row justify-content-between">
          <Button disabled={offset === 0} variant='link' onClick={() => handleGetPreviousTracks()}>Previous</Button>
          <Button disabled={(offset + getTrackLimit) >= trackCount} variant='link' onClick={() => handleGetNextTracks()}>Next</Button>
        </div>
      </div>
    )
  }

  function renderTracksList() {
    if(loadingTracks) {
      return <Spinner animation="border" role="status" />
    }
    if(!loadingTracks && tracksData.length === 0) {
      return <p>Can't find any tracks</p>
    }
    if(tracksData.length !== 0) {
      return tracksData.map(track => {
        return(
          <>
            <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)} getTracks={() => getTracksByUser()}/>
          </>
        )
      })
    }
  }

  const {userInfo} = props.userStore
  if(userInfo) {
    return (
      <div>
        <div className='mt-2 d-flex flex-row'>
          <h4 className='mr-5'>{pageParams.username}</h4>
          <SearchBar setQuery={(query) => setQuery(query)}/>
        </div>
        <div>
          <div className="d-flex flex-row align-items-baseline">
            <p>About:</p>
            {userInfo.username && userInfo.username === pageParams.username ? <Button variant="link" onClick={() => setAboutToggle(!aboutToggle)}>{aboutToggle ? "Edit -" : "Edit +"}</Button> : null}
          </div>
          {
            aboutToggle ? 
            EditSingleItem({
              typeOfEdit: 'about',
              toggle: 'about',
              inputType: 'textarea',
              handleEdit: (data) => handleEditAbout(data),
              item: about, setItem: setAbout}) 
            : <p className="ml-3">{userInfo.about ? userInfo.about: null}</p>
          }
        </div>
        <hr className='mt-1'/>
        <p className='d-flex flex-row justify-content-end'>Results: {trackCount}</p>
        {renderTracksList()}
        {renderPaginationButtons()}
      </div>
    )
  } else return null
}))

export default Profile
