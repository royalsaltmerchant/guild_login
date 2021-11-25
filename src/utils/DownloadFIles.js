import {getPresignedURL as getPresignedURLAPICall} from '../config/api'
import { awsConfig } from '../config/config'

export default async function downloadFiles(objectName) {
  const bucketName = awsConfig.bucketName
  const params = {
    bucket_name: bucketName,
    object_name: objectName
  }
  try {
    const res = await getPresignedURLAPICall(params)
    if(res.status === 200) {
      const downloadLink = res.data
      return downloadLink
    }
  } catch(err) {
    console.log(err)
    alert('Something went wrong, please try again.')
  }
}