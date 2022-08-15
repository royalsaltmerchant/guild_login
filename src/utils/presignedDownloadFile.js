import {getPresignedURLForDownload} from '../config/api'
import { awsConfig } from '../config/config'

export default async function downloadFile({objectName, downloadName}) {
  const bucketName = awsConfig.bucketName
  const params = {
    bucket_name: bucketName,
    object_name: objectName
  }
  if(downloadFile) params.download_name = downloadName
  
  try {
    const res = await getPresignedURLForDownload(params)
    if(res.status === 200) {
      const downloadLink = res.data
      return downloadLink
    }
  } catch(err) {
    console.log(err)
  }
}