import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { Image, Button, Spinner } from 'react-bootstrap'
import {finalConfig as config, awsConfig} from '../config/config'
import downloadFiles from '../utils/DownloadFIles'
import {inject, observer} from 'mobx-react'
import {
  editUser as editUserAPICall,
  editPack as editPackAPICall
} from '../config/api'

const PackDetails = inject('packsStore', 'userStore')(observer((props) => {
  const packNameParams = useParams()
  const [uri, setUri] = useState(null)

  useEffect(async () => {
    await getPackInfoByName()
    await props.userStore.getUserInfo()
    getPresignedURLForDownload()

  },[])

  async function getPackInfoByName() {
    const {packName} = packNameParams
    await props.packsStore.getPackInfo(packName)
  }

  async function handleDownloadClick(packInfo) {
    const {userInfo} = props.userStore
    const newCoinsAmount = userInfo.coins - packInfo.coin_cost
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

  async function getPresignedURLForDownload() {
    const {packName} = packNameParams
    const objectName = `packs/${packName}/${packName}.zip`

    try {
      const downloadLink = await downloadFiles(objectName)
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
        <h3>Cost:</h3>
        <h4>{packInfo.coin_cost} Coins</h4>
        <br />
        <Button  onClick={() => handleDownloadClick(packInfo)} disabled={props.userStore.userInfo.coins < packInfo.coin_cost || !uri}><a style={{color: 'white', textDecoration: 'none'}} href={uri}>Download</a></Button>
        <br />
        <small style={{color: 'red'}}>*{packInfo.coin_cost} coins will be deducted from your account</small>
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
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          <Image className="pack-img mr-3 mb-5" src={`${config.packImageURL}${packInfo.image_file}`} />
          <h3 className="text-center">Audio Demo</h3>
          <iframe className="video" src={packInfo.video_file} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
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
    <div className="d-flex flex-row flex-wrap justify-content-center w-75 p-3 border border-light rounded" style={{backgroundColor: '#fff'}}>
      {renderPackDetails()}
    </div>
  )
}))

export default PackDetails