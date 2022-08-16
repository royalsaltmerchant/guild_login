"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AWS = require('aws-sdk');
AWS.config.update({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-1'
});
const s3 = new AWS.S3();
function getSignedUrlForDownload(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: req.body.bucket_name,
            Key: req.body.object_name,
            Expires: 60 * 5,
        };
        if (req.body.download_name)
            params.ResponseContentDisposition = `filename="${req.body.download_name}"`;
        try {
            const url = yield new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', params, (err, url) => {
                    err ? reject(err) : resolve(url);
                });
            });
            res.send(url);
        }
        catch (err) {
            next(err);
        }
    });
}
function getSignedUrlForUpload(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: req.body.bucket_name,
            Fields: {
                key: req.body.object_name
            },
            Expires: 60 * 10
        };
        try {
            const url = yield new Promise((resolve, reject) => {
                s3.createPresignedPost(params, (err, url) => {
                    err ? reject(err) : resolve(url);
                });
            });
            res.send(url);
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getSignedUrlForDownload,
    getSignedUrlForUpload
};
