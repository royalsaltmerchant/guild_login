import React from 'react'
import {BiCoin} from 'react-icons/bi'
import {BsDownload} from 'react-icons/bs'
import Waveform from "react-audio-waveform"
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import {
  Button
} from 'react-bootstrap'
import { editTrackAsset as editTrackAssetAPICall, editUser as editUserAPICall } from '../config/api'

const TrackItem = inject('userStore')(observer((props) => {
  function handlePlayAudio(trackName) {
    const {tracksURLs} = props
    const assetURL = tracksURLs.filter(URL => URL.name === trackName)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }

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

  const {track, setQuery} = props
  return (
    <div className="mb-1 py-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded" style={{backgroundColor: 'white'}}>
      <div className="d-flex flex-row align-items-baseline justify-content-between">
        <p style={{fontSize: '22px'}}>{track.name}</p>
        <Button as={Link} variant="link" to={`/profile/${track.author_username}`}>{track.author_username}</Button>
      </div>
      <div className='d-flex flex-row' style={{width: '350px', alignSelf: 'center'}}>
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
        <p className="align-self-end ml-2" style={{color: 'grey', fontSize: '12px'}}>{track.length} s</p>
      </div>
      <div className="d-flex flex-row align-items-baseline">
        {track.audio_metadata.map(metatag =>
          <Button variant="link" onClick={() => setQuery(metatag)}>#{metatag}</Button>
        )}
      </div>
      <div className="d-flex flex-row align-items-baseline m-0 p-0">
        <p style={{fontSize: '15px', color: 'green'}}>10</p>
        <BiCoin className="align-self-center" style={{fontSize: '20px', color: 'orange'}} />
        <Button variant="link-secondary" style={{fontSize: '20px'}} onClick={() => handleDownload(track)}>
          <BsDownload />
        </Button>
      </div>
    </div>
  )
}))

export default TrackItem
