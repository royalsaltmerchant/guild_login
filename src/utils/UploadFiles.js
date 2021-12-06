import S3 from 'react-aws-s3'
import { awsConfig } from '../config/config'

export default async function UploadFiles(dirName, toUploadFilesList) {
  const config = {
    bucketName: awsConfig.bucketName,
    dirName: dirName,
    region: awsConfig.region,
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey
  }

  const S3Client = new S3(config)
  const successList = []
  const failedList = []

  await Promise.all(
    toUploadFilesList.map(async file => {
      try {
        const res = await S3Client.uploadFile(file, file.name)
        if(res.status === 204 || res.status === 200) {
          console.log('success', file.name)
          successList.push(file.name)
        } else {
          console.log('failed', file.name)
          failedList.push(file.name)
        }
      } catch(err) {
        console.log('failed', file.name)
        failedList.push(file.name)
      }
    })
  )
  return {successList: successList, failedList: failedList}
}