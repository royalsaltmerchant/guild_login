import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import {finalConfig as config} from '../config/config'
import {
  Spinner,
  Form,
  Button,
  Dropdown
} from 'react-bootstrap'
import { getTrackAssets } from '../config/api'
import downloadFile from '../utils/presignedDownloadFile'
import TrackItem from '../components/TrackItem'
import SearchBar from '../components/SearchBar'

const Library = inject('packsStore', 'userStore')(observer((props) => {
  const history = useHistory()
  const [view, setView] = useState('tracks')
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [tracksURLs, setTracksURLs] = useState([])
  const [trackCount, setTrackCount] = useState(0)
  const getTrackLimit = 10
  const [packImageURLs, setPackImageURLs] = useState()
  
  useEffect(() => {
    onload()
  },[])

  async function onload() {
    await props.packsStore.getPacks()
    getPackImageURLs()
    props.userStore.getUserInfo()
    if(view === 'tracks') handleGetTracks()
  }

  async function getPackImageURLs() {
    var packImageURLList = []
    await Promise.all(props.packsStore.packs.map(async pack => {
      var newURL = await downloadFile(`pack_images/${pack.image_file}`)
      packImageURLList.push(newURL)
    }))

    setPackImageURLs(packImageURLList)
  }

  function serializeSearch(type, newParam) {
    const params = new URLSearchParams({})

    if(type === 'query' && newParam !== '') {
      params.append('query', newParam)
      const filter = getFilter()
      if(filter) params.append("filter", filter)
    } 
    else if(type === 'filter') {
      if(newParam !== null) params.append('filter', newParam)
      const query = getQuery()
      if(query !== '') params.append('query', query)
    }
    else if(type === 'offset') {
      const filter = getFilter()
      if(filter) params.append("filter", filter)
      const query = getQuery()
      if(query !== '') params.append('query', query)
      if(newParam !== 0) params.append('offset', newParam)
    }

    const paramsAsString = params.toString()
    history.push({
      pathname: '/library',
      search: paramsAsString
    })
  }
  
  function setQuery(query) {
    serializeSearch('query', query)
    handleGetTracks()
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
    handleGetTracks()
  }

  function getOffset() {
    const {offset} = new Proxy(new URLSearchParams(history.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });  
    if(offset) {
      return offset
    } else return 0
  }

  function setFilter(filter) {
    serializeSearch('filter', filter)
    handleGetTracks()
  }

  function getFilter() {
    const {filter} = new Proxy(new URLSearchParams(history.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });  
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

  function renderFilterName() {
    if(getFilter()) {
      return getFilter()
    } else return "Filter"
  }

  function renderSelectFilter() {
    return(
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
        >
          {renderFilterName()}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setFilter(null)}>None</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('popular')}>popular</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('weapons')}>weapons</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('magic')}>magic</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('creatures')}>creatures</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('foley')}>foley</Dropdown.Item>
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
                getQuery() !== '' ?
                <div className='ml-2 d-flex flex-row align-items-baseline'>
                  <p>{`+ ${getQuery()}`}</p>
                  <Button variant="link" onClick={() => setQuery('')}>Remove</Button>
                </div> : null
              }
            </div>
            <p>Results: {trackCount}</p>
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
      limit: getTrackLimit
    }
    if(getQuery() !== '') {
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
            const presignedURL = await downloadFile(objectName)
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