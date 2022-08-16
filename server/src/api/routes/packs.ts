const express = require('express')
const {
  getAllPacks,
  addPack,
  editPack,
  removePack,
  removeAssetType,
  addAssetType,
  editAssetType,
  getPackByTitle
} = require('../controllers/packs')

var router = express.Router()

router.get('/packs', getAllPacks)
router.post('/get_pack_by_title', getPackByTitle)
router.post('/add_pack', addPack)
router.post('/edit_pack', editPack)
router.post('/remove_pack', removePack)
router.post('/add_asset_type', addAssetType)
router.post('/edit_asset_type', editAssetType)
router.post('/remove_asset_type', removeAssetType)

export default router