import {getPresignedURLForUpload} from '../config/api'

export default async function presignedUploadFile(file, preSignedParams) {
  try {
    const res = await getPresignedURLForUpload(preSignedParams)
    if(res.status === 200) {
      const formData  = new FormData()

      for(const field in res.data.fields) {
        formData.append(field, res.data[field])
      }
      formData.append('file', file)

      try {
        const resAWS = await fetch(res.data.url, {
          method: 'POST',
          body: formData
        })
        return resAWS
      } catch(err) {
        console.log('failed to upload to amazon s3', err)
      }
    }

  } catch(err) {
    console.log('failed to get presigned url for upload', err)
  }
}
