export const finalConfig = {
  apiURL: 'http://127.0.0.1:5000/api',
  websiteURL: 'localhost:3000',
  image_URL: 'https://sfguildsubmissions.s3.us-west-1.amazonaws.com/project_images/'
}

export const awsConfig = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  dirName: process.env.REACT_APP_DIR_NAME /* optional */,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
};