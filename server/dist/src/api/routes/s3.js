"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getSignedUrlForDownload, getSignedUrlForUpload } = require('../controllers/s3');
var router = express.Router();
router.post('/signed_URL_download', getSignedUrlForDownload);
router.post('/signed_URL_upload', getSignedUrlForUpload);
exports.default = router;
