import React, { useEffect, useState } from 'react'
import {BiCoin} from 'react-icons/bi'
import {BsDownload} from 'react-icons/bs'
import Waveform from "react-audio-waveform"
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import {
  Button, Form
} from 'react-bootstrap'
import { editTrackAsset as editTrackAssetAPICall, editUser as editUserAPICall } from '../config/api'


const TrackItem = inject('userStore')(observer((props) => {
  const [tagBoolean, setTagBoolean] = useState(false)

  function handlePlayAudio(trackName) {
    const {tracksURLs} = props
    const assetURL = tracksURLs.filter(URL => URL.name === trackName)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }
  
  useEffect(() => {
    props.userStore.getUserInfo()
  },[])

  async function handleDownload(track) {
    const {tracksURLs, userStore} = props
    const assetURL = tracksURLs.filter(URL => URL.name === track.name)[0]
    const newCurrentUserCoinsAmount = -Math.abs(10)
    const newAuthorUserCoinsAmount = 10
    const newDownloadsAmount = track.downloads + 1
    const editCurrentUserParams = {
      user_id: userStore.userInfo.id,
      coins: newCurrentUserCoinsAmount
    }
    const editAuthorUserParams = {
      user_id: track.author_id,
      coins: newAuthorUserCoinsAmount
    }
    const editTrackAssetParams = {
      track_id: track.id,
      downloads: newDownloadsAmount
    }

    // download
    const link = document.createElement("a")
    link.href = assetURL.url
    link.download = assetURL.name
    link.target = "_blank"
    link.click()

    // edit user and track
    try {
      await editUserAPICall(editCurrentUserParams)
      await editUserAPICall(editAuthorUserParams)
      await editTrackAssetAPICall(editTrackAssetParams)
    } catch(err) {
      console.log(err)
    }
  }

  async function handleAddTag(e, track) {
    const {getTracks} = props
    e.preventDefault()
    const tag = e.target.tag.value
    setTagBoolean(false)
    const params = {
      track_id: track.id,
      add_tag: tag
    }
    try {
      await editTrackAssetAPICall(params)
      getTracks()
    } catch(err) {
      console.log(err)
    }
  }

  async function handleRemoveTag(e, track, metatag) {
    const {getTracks} = props
    e.preventDefault()
    const params = {
      track_id: track.id,
      remove_tag: metatag
    }
    try {
      await editTrackAssetAPICall(params)
      getTracks()
    } catch(err) {
      console.log(err)
    }
  }

  function renderAddTag(track) {
    if(props.userStore.userInfo && track.author_id === props.userStore.userInfo.id) {
      if(tagBoolean) {
        return(
          <Form className="form-inline" onSubmit={e => handleAddTag(e, track)}>
            <Form.Group controlId="tag">
              <Form.Control 
                style={{width: '100px'}}
                size="sm"
                type="text"
                placeholder="Tag"
              />
            </Form.Group>
          </Form>
        )
      } else return <Button variant="link" onClick={() => setTagBoolean(true)}>+ Tag</Button>
    }
  }

  function renderTags(track, metatag) {
    if(props.userStore.userInfo && track.author_id === props.userStore.userInfo.id) {
      return(
        <div className='d-flex flex-row'>
          <Button variant="link" className="p-0 ml-2" onClick={() => setQuery(metatag)}>#{metatag}</Button>
          <Button variant="link" className="p-0 align-self-start" style={{color: 'red', fontSize: '13px'}} onClick={(e) => handleRemoveTag(e, track, metatag)}>✕</Button>
        </div>
      )
    } else return <Button variant="link" onClick={() => setQuery(metatag)}>#{metatag}</Button>
  }

  const {track, setQuery} = props
  return (
    <div className="mb-1 py-2 px-2 d-flex flex-row flex-wrap justify-content-between align-items-center border rounded" style={{backgroundColor: 'white'}}>
      <div className='d-flex flex-row flex-wrap ml-2 align-items-center'>
        <div className="d-flex flex-row flex-wrap align-items-baseline" style={{width: '350px'}}>
          <p style={{fontSize: '20px', margin: 0, padding: 0}}>{track.name}</p>
          <Button as={Link} variant="link" to={`/profile/${track.author_username}`}>{track.author_username}</Button>
        </div>
        <div className='waveform-div d-flex flex-row border rounded px-1' style={{width: '300px', paddingTop: '6px', backgroundColor: '#fdf0ff'}}>
          <div className="waveform" style={{width: '250px'}}>
            <Waveform
              barWidth={1}
              peaks={track.waveform}
              height={40}
              duration={track.length}
              // pos={this.props.pos}
              onClick={() => handlePlayAudio(track.name)}
              // color="green"
              progressColor="darkblue"
            />
          </div>
          <p className="align-self-end ml-2" style={{fontSize: '12px'}}>{track.length} s</p>
        </div>
      </div>
      <div className='d-flex flex-row flex-wrap align-items-center'>
        <div className="d-flex flex-row align-items-baseline">
          {track.audio_metadata && track.audio_metadata.length !== 0 ? track.audio_metadata.map(metatag =>
            renderTags(track, metatag)
            ) : "No Tags"}
            {renderAddTag(track)}
        </div>
        <div className="d-flex flex-row align-items-baseline p-0 ml-3">
          <p style={{fontSize: '15px', color: 'green'}}>10</p>
          <BiCoin className="align-self-center" style={{fontSize: '20px', color: 'orange'}} />
          <Button variant="link-secondary" style={{fontSize: '20px'}} onClick={() => handleDownload(track)}>
            <BsDownload />
          </Button>
        </div>
      </div>
    </div>
  )
}))

export default TrackItem
