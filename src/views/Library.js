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

const Library = inject('packsStore')(observer((props) => {
  const history = useHistory()
  const [view, setView] = useState('packs')
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState([])
  const [query, setQuery] = useState('')
  const [tracksURLs, setTracksURLs] = useState([])

  useEffect(() => {
    props.packsStore.getPacks()
  },[])

  useEffect(() => {
    handleTracksClicked()
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

  function handleSearch(event) {
    event.preventDefault()
    setQuery(event.target.formSearch.value.toLowerCase())
  }

  function renderSearchBar() {
    return(
      <Form className="form-inline" onSubmit={(event) => handleSearch(event)}>
        <Form.Group controlId="formSearch">
          <Form.Control 
            size="sm"
            type="search" 
            placeholder="Search"
          />
        </Form.Group>
      </Form>
    )
  }

  function renderTracksList() {
    if(loadingTracks) {
      return <Spinner animation="border" role="status" />
    }
    if(!loadingTracks && tracksData.length === 0) {
      return <p>Can't get tracks</p>
    }
    if(tracksData.length !== 0) {
      console.log(tracksData)
      return tracksData.map(track => {
        if(track.active === true) {
          return <TrackItem tracksURLs={tracksURLs} track={track}/>
        }
      })
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
        </div>
      )
    }
  }

  async function handleTracksClicked() {
    setView('tracks')
    setLoadingTracks(true)
    try {
      const res = await getTrackAssets(query)
      console.log(res)
      if(res.status === 200) {
        const newTracksURLs = []
        await Promise.all(
          res.data.map(async asset => {
            const assetName = asset.name
            const objectName = `tracks/${assetName}`
            const presignedURL = await downloadFiles(objectName)
            newTracksURLs.push({name: assetName, url: presignedURL})
          })
        )
        setTracksURLs(newTracksURLs)
        setTracksData(res.data)
        setLoadingTracks(false)
      } else throw new Error
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
          {renderSearchBar()}
        </div>
        <div>
          <Button variant="link" onClick={() => setView('packs')}>Packs</Button>
          <Button variant="link" onClick={() => handleTracksClicked()}>Tracks</Button>
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