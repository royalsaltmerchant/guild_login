import React, { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import {finalConfig as config} from '../config/config'
import { Spinner } from 'react-bootstrap'

const Library = inject('packsStore')(observer((props) => {
  const history = useHistory()

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
            <div key={pack.id} className="img-div p-3 m-3">
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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3 className="p-3 text-center">Available SFX Packs:</h3>
      <div className="d-flex flex-row flex-wrap">
        {renderSFXPacks()}
      </div>
    </div>
  )
}))

export default Library