import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { useHistory } from 'react-router'
import downloadFile from '../utils/presignedDownloadFile'
import {
  Spinner,
  Image
} from 'react-bootstrap'

const Packs = inject('packsStore')(observer((props) => {
  const history = useHistory()
  const [packImageURLs, setPackImageURLs] = useState()

  useEffect(() => {
    void async function init() {
      await props.packsStore.getPacks()
      getPackImageURLs()
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

  function renderPackImage(pack) {
    if(!packImageURLs) return null
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

  return(
    <div>
      <h4 className="pt-3">Packs</h4>
      <hr className='mt-1'/>
      <div className="d-flex flex-row">
        {renderSFXPacks()}
      </div>
    </div>
  )
}))

export default Packs
