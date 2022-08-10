const AWS = require('aws-sdk');

AWS.config.update({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1'
});

const s3 = new AWS.S3();

async function getSignedUrlForDownload(req, res, next) {
  const params = {
    Bucket: req.body.bucket_name,
    Key: req.body.object_name,
    Expires: 60 * 5
  };

  try {
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    res.send(url)
  } catch (err) {
    next(err)
  }
}

async function getSignedUrlForUpload(req, res, next) {
  const params = {
    Bucket: req.body.bucket_name,
    Fields: {
        key: req.body.object_name
    },
    Expires: 60 * 10
  };

  try {
    const url = await new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    res.send(url)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSignedUrlForDownload,
  getSignedUrlForUpload
}