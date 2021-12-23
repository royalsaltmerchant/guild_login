import React from 'react'
import {BiCoin} from 'react-icons/bi'
import {BsDownload} from 'react-icons/bs'
import Waveform from "react-audio-waveform"
import { Link } from 'react-router-dom'
import {
  Button
} from 'react-bootstrap'

export default function TrackItem(props) {
  function handlePlayAudio(trackName) {
    const {tracksURLs} = props
    const assetURL = tracksURLs.filter(URL => URL.name === trackName)[0].url
    const audio = new Audio(assetURL)
    audio.play()
  }

  const {track, setQuery} = props
  return (
    <div className="mb-1 py-2 px-2 d-flex flex-row justify-content-between align-items-baseline border rounded" style={{backgroundColor: 'white'}}>
      <div className="d-flex flex-row align-items-baseline justify-content-between">
        <p style={{fontSize: '22px'}}>{track.name}</p>
        <Button as={Link} variant="link" to={`/profile/${track.author}`}>{track.author}</Button>
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
        <Button variant="link-secondary" style={{fontSize: '20px'}}>
          <BsDownload />
        </Button>
      </div>
    </div>
  )
}
