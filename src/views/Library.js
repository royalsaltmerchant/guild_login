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
import {AiOutlineSound} from 'react-icons/ai'
import {BsDownload} from 'react-icons/bs'

const Library = inject('packsStore')(observer((props) => {
  const history = useHistory()
  const [view, setView] = useState('packs')

  useEffect(() => {
    props.packsStore.getPacks()
  },[])

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
                Details
              </button>
            </div>
          )   
        } 
      })
      return packMap
    }
  }

  function handleSearch() {
    
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

  function renderPacksOrTracksView() {
    if(view === 'packs') {
      return(
        <div>
          <h4 className="p-3">Packs</h4>
          <div className="d-flex flex-row">
            {renderSFXPacks()}
          </div>
        </div>
      )
    } else {
      return(
        <div>
          <h4 className="p-3">Tracks</h4>
          <div className="py-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded" style={{backgroundColor: 'white'}}>
            <Button variant="link">asset name <AiOutlineSound /></Button>
            <div className="d-flex flex-row align-items-baseline">
              <Button variant="link-secondary" style={{fontSize: '20px'}}><BsDownload /></Button>
            </div>
          </div>
        </div>
      )
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
          <Button variant="link" onClick={() => setView('tracks')}>Tracks</Button>
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