import { awsConfig } from '../config/config'
import { v4 as uuidv4 } from 'uuid'
import presignedUploadFile from './presignedUploadFile'

export default async function uploadAudioFiles(dirName, toUploadFilesList) {
  const FILE_SIZE_LIMIT = 2300000

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
        console.log(file.uuid, 'uuid')
        try {
          const preSignedParams = {
            bucket_name: awsConfig.bucketName,
            object_name: `${dirName}/${file.uuid}.wav`,
          }
          const res = await presignedUploadFile(file, preSignedParams)
          if(res && res.status === 204 || res.status === 200) {
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