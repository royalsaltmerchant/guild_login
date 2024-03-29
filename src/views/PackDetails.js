import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { Image, Button, Spinner } from 'react-bootstrap'
import downloadFile from '../utils/presignedDownloadFile'
import {inject, observer} from 'mobx-react'
import { BiCoin } from 'react-icons/bi'
import {
  editUser as editUserAPICall,
  editPack as editPackAPICall
} from '../config/api'

const PackDetails = inject('packsStore', 'userStore')(observer((props) => {
  const packNameParams = useParams()
  const [uri, setUri] = useState(null)
  const [packImageURL, setPackImageURL] = useState()

  useEffect(() => {
    void async function init() {
      await getPackInfoByName()
      getPackImageURL()
      await props.userStore.getUserInfo()
      getURLForDownload()  
    }()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function getPackImageURL() {
    const {packInfo} = props.packsStore
    var newURL = await downloadFile({objectName:`pack_images/${packInfo.image_file}`})
    console.log(newURL)
    setPackImageURL(newURL)
  }

  async function getPackInfoByName() {
    const {packName} = packNameParams
    await props.packsStore.getPackInfo(packName)
  }

  async function handleDownloadClick(packInfo) {
    const {userInfo} = props.userStore
    const newCoinsAmount = -Math.abs(packInfo.coin_cost)
    const newDownloadsAmount = packInfo.downloads + 1
    const editUserParams = {
      user_id: userInfo.id,
      coins: newCoinsAmount
    }
    const editPackParams = {
      pack_id: packInfo.id,
      downloads: newDownloadsAmount
    }

    try {
      await editUserAPICall(editUserParams)
      await editPackAPICall(editPackParams)
    } catch(err) {
      console.log(err)
    }
  }

  async function getURLForDownload() {
    const {packName} = packNameParams
    const objectName = `packs/${packName}/${packName}.zip`

    try {
      const downloadLink = await downloadFile({objectName})
      if(downloadLink) {
        setUri(downloadLink)
        return true
      } else throw new Error('Could not get download link')
    } catch(err) {
      console.log(err)
      return false
    }
  }

  function renderDownloadInfo() {
    if(props.userStore.userInfoLoading) {
      return <Spinner animation="border" role="status" />
    }
    if(!props.userStore.userInfo) {
      return null
    }
    const {packInfo} = props.packsStore
    return(
      <div className="d-flex flex-column justify-content-center align-items-center">
        <p>Cost:</p>
        <h4>{packInfo.coin_cost} <BiCoin className="align-self-center" style={{fontSize: '25px', color: 'orange'}} /></h4>
        {props.userStore.userInfo.coins < packInfo.coin_cost || !uri ? null : <Button  onClick={() => handleDownloadClick(packInfo)}><a style={{color: 'white', textDecoration: 'none'}} href={uri} download={packInfo.title}>Download</a></Button>}
      </div>
    )
  }

  function renderAssetTypes(assetTypes) {
    if(assetTypes) {
      const assetTypesMap = assetTypes.map(assetType => (
        <li key={assetType.id} className="px-3">{assetType.description}</li>
    ))
    return <ul>{assetTypesMap}</ul>
    }
  }

  function renderPackImage(pack) {
    if(!packImageURL) return <Spinner animation="border" role="status" />
    return <Image className="pack-img mr-3 mb-5" src={packImageURL} />
  }

  function renderPackDetails() {
    
    if(props.packsStore.packInfoLoading) {
      return <Spinner animation="border" role="status" />
    }
    
    if(!props.packsStore.packInfo) {
      return <p>Can't get pack details</p>
    }
    
    const {packInfo} = props.packsStore
    const packTitleSpaces = packInfo.title.replaceAll('-', ' ')
    const packTitle = packTitleSpaces.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return(
      <div className="d-flex flex-row align-items-center justify-content-center">
        <div className="d-flex flex-column">
          {renderPackImage(packInfo)}
          <h3 className="text-center">Audio Demo</h3>
          <iframe title='pack-vid' className="video" src={packInfo.video_file} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        <div className="w-50">
          <h1>{packTitle}</h1>
          <div className="px-3">
            <p>"{packInfo.description}"</p>
            <p>Asset Types:</p>
            {renderAssetTypes(packInfo.asset_types)}
          </div>
          <div className="my-5 d-flex flex-column justify-content-center align-items-center">
            {renderDownloadInfo()}
          </div>
        </div>
      </div>
    )

  }

  return (
    <div>
      {renderPackDetails()}
    </div>
  )
}))

export default PackDetails