import {getPresignedURLForUpload} from '../config/api'

export default async function presignedUploadFile(file, preSignedParams) {
  try {
    const res = await getPresignedURLForUpload(preSignedParams)
    if(res.status === 200) {
      const presignedData = res.data.fields
      const formData  = new FormData()

      formData.append('key', presignedData.key)
      formData.append('AWSAccessKeyId', presignedData.AWSAccessKeyId)
      formData.append('policy', presignedData.policy)
      formData.append('signature', presignedData.signature)
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
