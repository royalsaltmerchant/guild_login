export const finalConfig = {
  apiURL: 'https://api.royalsaltserver.com',
  websiteURL: 'localhost:3000',
  projectImageURL: 'https://sfguildsubmissions.s3.us-west-1.amazonaws.com/project_images/',
  packImageURL: 'https://sfguildsubmissions.s3.us-west-1.amazonaws.com/pack_images/',
  s3_base_URL: 'https://sfguildsubmissions.s3.us-west-1.amazonaws.com/'
}

export const awsConfig = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  dirName: process.env.REACT_APP_DIR_NAME /* optional */,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
};