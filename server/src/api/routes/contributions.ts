const express = require('express')
const {
  // getAllContributions,
  getContributionById,
  addContribution,
  editContribution,
  addContributedAsset,
  editContributedAsset
} = require('../controllers/contributions')

var router = express.Router()

// router.get('/contributions', getAllContributions)
router.post('/get_contribution', getContributionById)
router.post('/add_contribution', addContribution)
router.post('/edit_contribution', editContribution)
router.post('/add_contributed_asset', addContributedAsset)
router.post('/edit_contributed_asset', editContributedAsset)

export default router