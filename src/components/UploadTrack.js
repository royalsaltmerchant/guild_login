import React, {useState} from 'react'
import Uploader from './Uploader';
import { addTrackAsset } from '../config/api';

export default function UploadTrack(props) {
  const [complete, setComplete] = useState(false)
  const dirName = `tracks`

  async function handleComplete(successList) {
    await Promise.all(
      successList.map(async file => {
        const formData = new FormData()
        formData.append("audio_file", file)
        formData.append("name", file.name)
        formData.append("author_id", props.authorId)
        formData.append("uuid", file.uuid)

        try{
          await addTrackAsset(formData)
        } catch(err) {
          console.log(err)
          window.alert(`Something went wrong, please try again later.`)
        }
      })
    )

    setComplete(true)
    props.uploadTrackBoolean(false)
  }

  function calculateCanUploadMoreIfNotPremium(currentUploadAmount) {
    if((props.upload_count + currentUploadAmount) > 20) {
      return false
    } else return true
  }

  return (
    <div className="p-3 border rounded card-style admin-tools-item">
      <Uploader
        dirName={dirName}
        complete={complete}
        handleComplete={(successList) => handleComplete(successList)}
        calculateCanUploadMoreIfNotPremium={!props.premium ? (currentUploadAmount) => calculateCanUploadMoreIfNotPremium(currentUploadAmount) : null}
      />
    </div>
  )
}

