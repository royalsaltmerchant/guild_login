import S3 from 'react-aws-s3'
import { awsConfig } from '../config/config'
import { v4 as uuidv4 } from 'uuid'

export default async function UploadFiles(dirName, toUploadFilesList) {
  const config = {
    bucketName: awsConfig.bucketName,
    dirName: dirName,
    region: awsConfig.region,
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey
  }

  const FILE_SIZE_LIMIT = 2300000

  const S3Client = new S3(config)
  const successList = []
  const failedList = []

  await Promise.all(
    toUploadFilesList.map(async file => {
      if(file.size > FILE_SIZE_LIMIT) {
        file.failMessage = `Size limit exceeded`
        failedList.push(file)
      } else {
        // hash file name
        const uuid = uuidv4()
        file.uuid = uuid
        try {
          const res = await S3Client.uploadFile(file, uuid)
          if(res.status === 204 || res.status === 200) {
            console.log('success', file.name)
            successList.push(file)
          } else {
            console.log('failed', file)
            failedList.push(file)
          }
        } catch(err) {
          console.log('failed', file)
          failedList.push(file)
        }
      }
    })
  )
  return {successList: successList, failedList: failedList}
}