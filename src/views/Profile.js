import React, { useEffect, useState } from 'react'
import { getTrackAssetsByUsername } from '../config/api'
import downloadFiles from '../utils/DownloadFIles'
import { Spinner, Button } from 'react-bootstrap'
import TrackItem from '../components/TrackItem'
import { useParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

export default function Profile() {
  const params = useParams()
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState([])
  const [query, setQuery] = useState('')
  const [tracksURLs, setTracksURLs] = useState([])
  const [offset, setOffset] = useState(0)
  const [trackCount, setTrackCount] = useState(0)
  const getTrackAmount = 20

  useEffect(() => {
    getTracksByUser({getMore: false})
  },[])

  useEffect(() => {
    getTracksByUser({getMore: true})
  }, [offset])

  async function getTracksByUser({getMore}) {
    setLoadingTracks(true)
    try {
      const res = await getTrackAssetsByUsername(params.username, offset, getTrackAmount)
      if(res.status === 200) {
        const newTracksURLs = []
        await Promise.all(
          res.data.tracks.map(async asset => {
            const assetName = asset.name
            const objectName = `tracks/${assetName}`
            const presignedURL = await downloadFiles(objectName)
            newTracksURLs.push({name: assetName, url: presignedURL})
          })
        )
        if(getMore) {
          setTracksURLs([...tracksURLs, ...newTracksURLs])
          setTracksData([...tracksData, ...res.data.tracks])
          setLoadingTracks(false)
        } else {
          setTracksURLs(newTracksURLs)
          setTracksData(res.data.tracks)
          setLoadingTracks(false)
        }
        setTrackCount(res.data.track_count)
      } else throw new Error()
    } catch(err) {
      setLoadingTracks(false)
      console.log(err)
    }
  }

  function handleGetMoreTracks() {
    setOffset(offset + 20)
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
        return(
          <>
            <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)}/>
          </>
        )
      })
    }
  }

  return (
    <div>
      <div className='mt-2 d-flex flex-row'>
        <h4 className='mr-5'>{params.username}</h4>
      </div>
      <br />
      {renderTracksList()}
      {tracksData.length !== trackCount ? <Button variant='link' onClick={() => handleGetMoreTracks()}>Get More Tracks</Button> : null}
    </div>
  )
}
