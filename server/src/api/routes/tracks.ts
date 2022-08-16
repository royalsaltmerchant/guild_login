const express = require('express')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const {
  addTrackAsset,
  getTrackAssets,
  editTrackAsset,
  removeTrackAsset
} = require('../controllers/tracks')

var router = express.Router()

router.post('/add_track_asset', upload.any(), addTrackAsset)
router.post('/get_track_assets', getTrackAssets)
router.post('/edit_track_asset', editTrackAsset)
router.post('/remove_track_asset', removeTrackAsset)
router.post('/get_track_assets_by_username/:username', getTrackAssets)

export default router