const {
  getContributionByIdQuery,
  addContributionQuery,
  editContributionQuery
} = require('../queries/contributions')
const {
  addContributedAssetQuery,
  getContributedAssetsByContributionIdQuery,
  editContributedAssetQuery
} = require('../queries/contributedAssets')

async function getContributionById(req, res, next) {
  try {
    const contributionData = await getContributionByIdQuery(req.body.contribution_id)

    const contributedAssetsData = await getContributedAssetsByContributionIdQuery(req.body.contribution_id)

    const data = contributionData.rows[0]
    
    data.contributed_assets = contributedAssetsData.rows

    res.send(data)
  } catch(err) {
    next(err)
  }
}

async function addContribution(req, res, next) {
  try {
    const contributionData = await addContributionQuery(req.body)
    res.status(201).json(contributionData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editContribution(req, res, next) {
  try {
    const contributionData = await editContributionQuery(req.body)
    res.send(contributionData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function addContributedAsset(req, res, next) {
  try {
    const assetData = await addContributedAssetQuery(req.body)
    res.status(201).json(assetData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editContributedAsset(req, res, next) {
  try {
    const assetData = await editContributedAssetQuery(req.body)
    res.send(assetData.rows[0])
  } catch(err) {
    next(err)
  }
}

module.exports = {
  getContributionById,
  addContribution,
  addContributedAsset,
  editContribution,
  editContributedAsset
}