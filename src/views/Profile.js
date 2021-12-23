import React, { useEffect, useState } from 'react'
import { getTrackAssetsByUsername } from '../config/api'
import downloadFiles from '../utils/DownloadFIles'
import { Spinner } from 'react-bootstrap'
import TrackItem from '../components/TrackItem'
import { useParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

export default function Profile() {
  const params = useParams()
  const [tracksData, setTracksData] = useState([])
  const [loadingTracks, setLoadingTracks] = useState([])
  const [query, setQuery] = useState('')
  const [tracksURLs, setTracksURLs] = useState([])

  useEffect(() => {
    getTracksByUser()
  },[])

  async function getTracksByUser() {
    setLoadingTracks(true)
    try {
      const res = await getTrackAssetsByUsername(params.username)
      console.log(res)
      if(res.status === 200) {
        const newTracksURLs = []
        await Promise.all(
          res.data.map(async asset => {
            const assetName = asset.name
            const objectName = `tracks/${assetName}`
            const presignedURL = await downloadFiles(objectName)
            newTracksURLs.push({name: assetName, url: presignedURL})
          })
        )
        setTracksURLs(newTracksURLs)
        setTracksData(res.data)
        setLoadingTracks(false)
      } else throw new Error()
    } catch(err) {
      setLoadingTracks(false)
      console.log(err)
    }
  }

  function renderTracksList() {
    if(loadingTracks) {
      return <Spinner animation="border" role="status" />
    }
    if(!loadingTracks && tracksData.length === 0) {
      return <p>Can't get tracks</p>
    }
    if(tracksData.length !== 0) {
      console.log(tracksData)
      return tracksData.map(track => {
        return <TrackItem tracksURLs={tracksURLs} track={track} setQuery={(query) => setQuery(query)}/>
      })
    }
  }

  return (
    <div>
      <div className='mt-2 d-flex flex-row'>
        <h4 className='mr-5'>{params.username}</h4>
        <SearchBar setQuery={(query) => setQuery(query)}/>
      </div>
      <br />
      {renderTracksList()}
    </div>
  )
}
