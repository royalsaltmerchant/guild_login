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

        try{
          await addTrackAsset(formData)
        } catch(err) {
          console.log(err)
        }
      })
    )

    setComplete(true)
    props.uploadTrackBoolean(false)
  }

  
  return (
    <div className="p-3 border rounded card-style admin-tools-item">
      <Uploader
        dirName={dirName}
        complete={complete}
        handleComplete={(successList) => handleComplete(successList)}
      />
    </div>
  )
}

