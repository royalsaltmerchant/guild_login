import React, { useState, useEffect } from 'react'
import {BiCoin} from 'react-icons/bi'
import {BsDownload} from 'react-icons/bs'
import {GiRoundStar} from 'react-icons/gi'
import Waveform from "react-audio-waveform"
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import {
  Button, Form
} from 'react-bootstrap'
import { editTrackAsset as editTrackAssetAPICall, editUser as editUserAPICall, removeTrackAsset as removeTrackAssetAPICall } from '../config/api'


const TrackItem = inject('userStore')(observer((props) => {
  const [trackToggle, setTrackToggle] = useState(false)
  const [tagBoolean, setTagBoolean] = useState(false)
  const [metadata, setMetadata] = useState([])
  const DEFAULT_COIN_COST = 10

  useEffect(() => {
    setMetadata(props.track.metadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePlayAudio(trackUUID) {
    const {tracksURLs} = props
    const assetURL = tracksURLs.filter(URL => URL.uuid === trackUUID)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }

  async function handleDownload(track) {
    const {userStore} = props
    const newCurrentUserCoinsAmount = -Math.abs(DEFAULT_COIN_COST)
    const newAuthorUserCoinsAmount = DEFAULT_COIN_COST
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

    // edit user and track
    if(props.userStore.userInfo && track.author_id !== props.userStore.userInfo.id) {
        try {
          await editUserAPICall(editCurrentUserParams)
          props.userStore.getUserInfo()
          await editUserAPICall(editAuthorUserParams)
          await editTrackAssetAPICall(editTrackAssetParams)
        } catch(err) {
          console.log(err)
        }
    }
  }

  async function handleAddTag(e, track) {
    e.preventDefault()
    const tag = e.target.tag.value
    setTagBoolean(false)
    const params = {
      track_id: track.id,
      add_tag: tag
    }
    try {
      await editTrackAssetAPICall(params)
      setMetadata([...metadata, tag])
    } catch(err) {
      console.log(err)
    }
  }

  async function handleRemoveTag(e, track, tag) {
    e.preventDefault()
    const params = {
      track_id: track.id,
      remove_tag: tag
    }
    try {
      await editTrackAssetAPICall(params)
      const newMetadata = metadata.filter(oldTag => oldTag !== tag)
      setMetadata(newMetadata)
    } catch(err) {
      console.log(err)
    }
  }

  async function handleRemoveTrack(e, track) {
    e.preventDefault()
    try {
      await removeTrackAssetAPICall(track.id)
      props.getTracks()
    } catch(err) {
      console.log(err)
    }
  }

  function renderAddTag(track) {
    if(props.userStore.userInfo && track.author_id === props.userStore.userInfo.id && metadata.length < 20) {
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
        <div key={metatag} className='d-flex flex-row flex-wrap'>
          <Button variant="link" className="p-0 ml-2" onClick={() => setQuery(metatag)}>#{metatag}</Button>
          <Button variant="link" className="p-0 align-self-start" style={{color: 'red', fontSize: '13px'}} onClick={(e) => handleRemoveTag(e, track, metatag)}>✕</Button>
        </div>
      )
    } else return <Button key={metatag} variant="link" onClick={() => setQuery(metatag)}>#{metatag}</Button>
  }

  function renderRemove(track) {
    if(props.userStore.userInfo && track.author_id === props.userStore.userInfo.id) {
      return <Button variant="link" className="p-0 align-self-center" style={{color: 'red', fontSize: '25px', marginLeft: '30px'}} onClick={(e) => handleRemoveTrack(e, track)}>✕</Button>
    }
  }

  function renderTrackAuthorIsPremium() {
    const {track} = props
    const {usersList} = props.userStore
    const user = usersList.filter((user) => track.author_id === user.id)[0]
    if(user.premium) return <GiRoundStar style={{color: 'orange', marginBottom: '5px'}}/>
    else return null
  }

  function handleTrackToggle(e) {
    if(e.target === e.currentTarget) {
      e.preventDefault()
      setTrackToggle(!trackToggle)
    }
  }

  function getTrackDownloadDisabled(track) {
    if(track.author_id === props.userStore.userInfo.id) {
      return true
    } else if(props.userStore.userInfo.coins < DEFAULT_COIN_COST) {
      return false
    } else return true
  }

  const {track, setQuery, tracksURLs} = props
  const {usersList} = props.userStore
  const authorUsername = usersList.filter((user) => track.author_id === user.id)[0].username
  const assetURL = tracksURLs.filter(URL => URL.uuid === track.uuid)[0]
  return (
    <div className='d-flex flex-column  border rounded track-button' style={{backgroundColor: 'white'}} onClick={(e) => handleTrackToggle(e)}>
      <div className="mb-1 py-2 px-2 d-flex flex-row flex-wrap justify-content-between align-items-center" onClick={(e) => handleTrackToggle(e)}>
        <div className='d-flex flex-row flex-wrap ml-2 align-items-center' onClick={(e) => handleTrackToggle(e)}>
          <div className="d-flex flex-row flex-wrap align-items-baseline" style={{width: '450px'}} onClick={(e) => handleTrackToggle(e)}>
            <p style={{fontSize: '20px', margin: 0, padding: 0}}>{track.name}</p>
            <Button as={Link} variant="link" to={`/profile/${authorUsername}`}>{renderTrackAuthorIsPremium(track)} {authorUsername}</Button>
          </div>
          <div className='waveform-div d-flex flex-row border rounded px-1' style={{width: '300px', paddingTop: '6px', backgroundColor: '#fdf0ff'}}>
            <div className="waveform" style={{width: '250px'}}>
              <Waveform
                barWidth={1}
                peaks={track.waveform}
                height={40}
                duration={track.length}
                // pos={this.props.pos}
                onClick={() => handlePlayAudio(track.uuid)}
                // color="green"
                progressColor="darkblue"
              />
            </div>
            <p className="align-self-end ml-2" style={{fontSize: '12px'}}>{track.length} s</p>
          </div>
        </div>
        <div className='d-flex flex-row flex-wrap align-items-center'>
          <div className="d-flex flex-row align-items-baseline p-0 ml-3">
            {props.userStore.userInfo && track.author_id === props.userStore.userInfo.id ? null : <BiCoin className="align-self-center" style={{fontSize: '30px', color: 'orange', paddingRight: 0}} />}
            {props.userStore.userInfo && track.author_id === props.userStore.userInfo.id ? null : <p style={{fontSize: '15px', color: 'green'}}>{DEFAULT_COIN_COST}</p>}
            {
              props.userStore.userInfo ?
              <Button
                id="download"
                className='d-flex flex-row'
                title="Download" 
                disabled={getTrackDownloadDisabled(track)}
                variant="link-secondary" 
                style={{fontSize: '30px', 
                  paddingRight: 0, 
                  paddingTop: 0
                }} 
                onClick={() => handleDownload(track)}>
                  <a style={{color:'inherit'}} download={assetURL.name} href={assetURL.url}><BsDownload/></a>
              </Button>
              : null
            }
            {renderRemove(track)}
          </div>
        </div>
      </div>
      <div onClick={(e) => handleTrackToggle(e)}>
        {
          props.userStore.userInfo && trackToggle ?
          <p onClick={(e) => handleTrackToggle(e)} className='ml-3 mr-2 mb-0 mt-0 p-0' style={{color: 'purple'}}>{track.downloads} {track.downloads.length === 1 ? "Download" : "Downloads"}</p>
          : null
        }
        {
          trackToggle ? 
          <div className="d-flex flex-row align-items-baseline" onClick={(e) => handleTrackToggle(e)}>
            <div className='m-3 d-flex flex-row'>
              <p className='p-0 m-0'>Searchable Tags:</p>
              {track.metadata && metadata.length !== 0 ? metadata.map(metatag =>
                renderTags(track, metatag)
                ) : "-- No Tags --"}
                {renderAddTag(track)}
            </div>
          </div>
          : null
        }
      </div>
    </div>
  )
}))

export default TrackItem
