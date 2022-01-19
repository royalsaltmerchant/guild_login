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
  const getTrackAmount = 20

  useEffect(() => {
    props.packsStore.getPacks()
  },[])

  useEffect(() => {
    handleGetTracks({getMore: true})
  }, [offset])

  useEffect(() => {
    handleGetTracks({getMore: false})
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

  function handleGetMoreTracks() {
    setOffset(offset + 20)
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
              <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)}/>
            </>
          )
        }
      })
    }
  }

  function renderGetMoreButton() {
    if(tracksData.length !== trackCount) {
      return(
        <div className='py-5 text-center'>
          <p>{offset + 20} of {trackCount}</p>
          <Button variant='link' onClick={() => handleGetMoreTracks()}>Get More Tracks</Button>
        </div>
      )
    }
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
          {renderTracksList()}
          {renderGetMoreButton()}
        </div>
      )
    }
  }

  async function handleGetTracks({getMore}) {
    setView('tracks')
    setLoadingTracks(true)
    try {
      const res = await getTrackAssets(query, offset, getTrackAmount)
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
        if(getMore) {
          setTracksURLs([...tracksURLs, ...newTracksURLs])
          setTracksData([...tracksData, ...res.data.tracks])
          setLoadingTracks(false)
        } else {
          setTracksURLs(newTracksURLs)
          setTracksData(res.data.tracks)
          setLoadingTracks(false)
        }
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
          <Button variant="link" onClick={() => handleGetTracks({getMore: false})}>Tracks</Button>
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