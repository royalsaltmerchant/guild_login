import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import {finalConfig as config} from '../config/config'
import {
  Spinner,
  Form,
  Button
} from 'react-bootstrap'
import { getTrackAssets } from '../config/api'
import downloadFiles from '../utils/DownloadFIles'
import TrackItem from '../components/TrackItem'
import SearchBar from '../components/SearchBar'

const Library = inject('packsStore')(observer((props) => {
  const history = useHistory()
  const [view, setView] = useState('packs')
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState([])
  const [query, setQuery] = useState('')
  const [tracksURLs, setTracksURLs] = useState([])
  const [offset, setOffset] = useState(0)
  const [trackCount, setTrackCount] = useState(0)
  const getTrackLimit = 10

  useEffect(() => {
    props.packsStore.getPacks()
  },[])

  useEffect(() => {
    handleGetTracks()
  }, [offset])

  useEffect(() => {
    setOffset(0)
    handleGetTracks()
  }, [query])

  function renderSFXPacks() {
    const {packs, packsLoading} = props.packsStore
    
    if(packsLoading) {
      return <Spinner animation="border" role="status" />
    }

    if(!packs) {
      return(
        <p>Can't get packs!</p>
      )
    }
    else {
      const packMap = packs.map(pack => {
        const editedPackTitle = pack.title.replaceAll(' ', '-').toLowerCase()
        
        if(pack.active) {
          return(
            <div key={pack.id} className="img-div p-3">
              <Image className="pack-img" src={`${config.packImageURL}${pack.image_file}`} />
              <button className="di-btn" onClick={() => history.push(`/pack/${editedPackTitle}`)}>
                Info
              </button>
            </div>
          )   
        } 
      })
      return packMap
    }
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
        if(track.active === true) {
          return(
            <>
              <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)} getTracks={() => handleGetTracks()}/>
            </>
          )
        }
      })
    }
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

  function renderPacksOrTracksView() {
    if(view === 'packs') {
      return(
        <div>
          <h4 className="pt-3">Packs</h4>
          <hr />
          <div className="d-flex flex-row">
            {renderSFXPacks()}
          </div>
        </div>
      )
    } else {
      return(
        <div>
          <h4 className="pt-3">Tracks</h4>
          <hr />
          <p className='d-flex flex-row justify-content-end'>Results: {trackCount}</p>
          {renderTracksList()}
          {renderPaginationButtons()}
        </div>
      )
    }
  }

  async function handleGetTracks() {
    setView('tracks')
    setLoadingTracks(true)
    const params = {
      offset: offset,
      limit: getTrackLimit
    }
    if(query !== "") {
      console.log(query)
      params.query = query
    }
    try {
      const res = await getTrackAssets(params)
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
  
  return (
    <div>
      <div className="border rounded mt-2 d-flex flex-row px-2 py-1" style={{backgroundColor: '#ebebeb', width: '100%'}}>
        <div className="d-flex flex-row align-items-center mr-5">
          <h5 className="mt-1 mr-5">Library</h5>
          <SearchBar setQuery={(query) => setQuery(query)}/>
        </div>
        <div>
          <Button variant="link" onClick={() => setView('packs')}>Packs</Button>
          <Button variant="link" onClick={() => handleGetTracks()}>Tracks</Button>
        </div>
      </div>
      {renderPacksOrTracksView()}
      {/* <div className="border ml-auto" style={{width: '170px'}}>
        <p>okay</p>
      </div> */}
    </div>
  )
}))

export default Library