import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import {
  Spinner,
  Button,
  Dropdown
} from 'react-bootstrap'
import { getTrackAssets } from '../config/api'
import downloadFile from '../utils/presignedDownloadFile'
import TrackItem from '../components/TrackItem'
import SearchBar from '../components/SearchBar'

const Library = inject('packsStore', 'userStore')(observer((props) => {
  const history = useHistory()
  const searchParams = new URLSearchParams(history.location.search)
  const [view, setView] = useState('tracks')
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [tracksURLs, setTracksURLs] = useState([])
  const [trackCount, setTrackCount] = useState(0)
  const [packImageURLs, setPackImageURLs] = useState()
  
  useEffect(() => {
    void async function init() {
      await props.packsStore.getPacks()
      getPackImageURLs()
      await props.userStore.getUserInfo()
      await props.userStore.getUsersList()
      if(view === 'tracks') {
        handleGetTracks()
      }
    }()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function getPackImageURLs() {
    var packImageURLList = []
    await Promise.all(props.packsStore.packs.map(async pack => {
      var newURL = await downloadFile({objectName:`pack_images/${pack.image_file}`})
      packImageURLList.push(newURL)
    }))

    setPackImageURLs(packImageURLList)
  }

  function updateSearchParams(type, newParam) {
    searchParams.set(type, newParam)

    const stringParams = searchParams.toString()
    history.push({
      pathname: '/library',
      search: stringParams
    })
  }

  function removeSearchParam(type) {
    searchParams.delete(type)

    const stringParams = searchParams.toString()
    history.push({
      pathname: '/library',
      search: stringParams
    })
  }
  
  function setQuery(query) {
    if(query) {
      updateSearchParams('query', query)
    } else removeSearchParam('query')

    handleGetTracks()
  }

  function getQuery() {
    const query = searchParams.get('query')
    if(query) {
      return query
    } else return null
  }

  function setTrackLimit(limit) {
    // reset offset
    removeSearchParam('offset')
    // set or remove limit
    if(limit) {
      updateSearchParams('limit', limit)
    } else removeSearchParam('limit')
    handleGetTracks()
  }

  function getTrackLimit() {
    const limit = searchParams.get('limit')
    if(limit) {
      return limit
    } else return 30
  }

  function setOffset(offset) {
    if(offset) {
      updateSearchParams('offset', offset)
    } else removeSearchParam('offset')
    handleGetTracks()
  }


  function getOffset() {
    const offset = searchParams.get('offset')
    if(offset) {
      return offset
    } else return 0
  }

  function setFilter(filter) {
    if(filter) {
      updateSearchParams('filter', filter)
    } else removeSearchParam('filter')
    handleGetTracks()
  }

  function getFilter() {
    const filter = searchParams.get('filter')
    if(filter) {
      return filter
    } else return null
  }

  function renderPackImage(pack) {
    if(!packImageURLs) return <Spinner animation="border" role="status" />
    const packImageURL = packImageURLs.filter(url => url.includes(pack.image_file))
    return <Image className="pack-img" src={packImageURL} />
  }

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
              {renderPackImage(pack)}
              <button className="di-btn" onClick={() => history.push(`/pack/${editedPackTitle}`)}>
                Info
              </button>
            </div>
          )   
        } else return null
      })
      return packMap
    }
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
        if(track.active === true) {
          return(
            <div key={track.id}>
              <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)} getTracks={() => handleGetTracks()}/>
            </div>
          )
        } else return null
      })
    }
  }

  function handleGetNextTracks() {
    var offsetInt = parseInt(getOffset())
    var limitInt = parseInt(getTrackLimit())
    setOffset(offsetInt + limitInt)
  }

  function handleGetPreviousTracks() {
    var offsetInt = parseInt(getOffset())
    var limitInt = parseInt(getTrackLimit())
    setOffset(offsetInt - limitInt)
  }
  
  function renderPaginationButtons() {
    return(
      <div className='py-3 text-center align-items-center'>
        <div className="d-flex flex-row justify-content-between">
          <Button disabled={parseInt(getOffset()) === 0} variant='link' onClick={() => handleGetPreviousTracks()}>Previous</Button>
          <Button disabled={trackCount < parseInt(getTrackLimit())} variant='link' onClick={() => handleGetNextTracks()}>Next</Button>
        </div>
      </div>
    )
  }

  function renderSelectFilter() {
    return(
      <Dropdown onSelect={(e) => {setFilter(e) }}>
        <Dropdown.Toggle
          variant="outline-secondary"
        >
          {getFilter() ? getFilter() : 'Filter'}
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
      <Dropdown onSelect={(e) => {setTrackLimit(e) }}>
        <Dropdown.Toggle
          variant="outline-secondary"
        >
          {getTrackLimit()}
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
      return(
        <div>
          <h4 className="pt-3">Packs</h4>
          <hr className='mt-1'/>
          <div className="d-flex flex-row">
            {renderSFXPacks()}
          </div>
        </div>
      )
    } else {
      return(
        <div>
          <h4 className="pt-3">Tracks</h4>
          <hr className='mt-1'/>
          <div className='p-1 d-flex flex-row justify-content-between'>
            <div className='d-flex flex-row align-items-baseline'>
              {renderSelectFilter()}  
              {
                getQuery() ?
                <div className='ml-2 d-flex flex-row align-items-baseline'>
                  <p>{`+ ${getQuery()}`}</p>
                  <Button variant="link" onClick={() => setQuery(null)}>Remove</Button>
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

  async function handleGetTracks() {
    setLoadingTracks(true)
    const params = {
      offset: parseInt(getOffset()),
      limit: parseInt(getTrackLimit()) ? parseInt(getTrackLimit()) : 30
    }
    if(getQuery()) {
      params.query = getQuery()
    }
    if(getFilter()) {
      params.filter = getFilter()
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
  
  return (
    <div>
      <div className="border rounded d-flex flex-row px-2 py-1" style={{backgroundColor: '#ebebeb', width: '100%'}}>
        <div className="d-flex flex-row align-items-center mr-5">
          <h5 className="mt-1 mr-5">Library</h5>
          {view === 'tracks' ? <SearchBar setQuery={(query) => setQuery(query)}/> : null}
        </div>
        <div>
          <Button variant="link" onClick={() => setView('packs')}>Packs</Button>
          <Button variant="link" onClick={() => setView('tracks')}>Tracks</Button>
        </div>
      </div>
      {renderPacksOrTracksView()}
    </div>
  )
}))

export default Library