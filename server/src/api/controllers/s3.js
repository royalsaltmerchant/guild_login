const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
    Key: req.body.object_name,
    Expires: 60 * 10,
    Conditions: [
      ['content-length-range', 0, 30000000], // 30 Mb
      {'acl': 'public-read'}
    ]
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