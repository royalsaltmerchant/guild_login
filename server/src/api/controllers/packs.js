const { 
  getAllPacksQuery,
  removePackQuery,
  addPackQuery,
  editPackQuery,
  getPackByTitleQuery
} = require('../queries/packs')
const {
  getAllAssetTypesQuery,
  removeAssetTypeQuery,
  addAssetTypeQuery,
  editAssetTypeQuery,
  getAssetTypesByPackIdQuery
} = require('../queries/assetTypes')

async function getAllPacks(req, res, next) {
  try {
    const packData = await getAllPacksQuery()

    const assetTypeData = await getAllAssetTypesQuery()

    for(var pack of packData.rows) {
      pack['asset_types'] = assetTypeData.rows.filter(assetType => assetType.pack_id === pack.id)
    }

    res.send(packData.rows)
  } catch(err) {
    next(err)
  }
}

async function getPackByTitle(req, res, next) {
  try {
    const packData = await getPackByTitleQuery(req.body.pack_title)
    
    const pack = packData.rows[0]

    const assetTypeData = await getAssetTypesByPackIdQuery(pack.id)

    pack.asset_types = assetTypeData.rows

    res.send(pack)
  } catch(err) {
    next(err)
  }
}

async function addPack(req, res, next) {
  try {
    const packData = await addPackQuery(req.body)
    res.status(201).json(packData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editPack(req, res, next) {
  try {
    const packData = await editPackQuery(req.body)
    res.send(packData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function removePack(req, res, next) {
  try {
    await removePackQuery(req.body.pack_id)
    res.send({message: `Successfully removed pack: ${req.body.pack_id}`})
  } catch(err) {
    next(err)
  }
}

async function addAssetType(req, res, next) {
  try {
    const assetData = await addAssetTypeQuery(req.body)
    res.status(201).json(assetData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editAssetType(req, res, next) {
  try {
    const assetData = await editAssetTypeQuery(req.body)
    res.send(assetData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function removeAssetType(req, res, next) {
  try {
    await removeAssetTypeQuery(req.body.asset_type_id)
    res.send({message: `Successfully asset Type: ${req.body.asset_type_id}`})
  } catch(err) {
    next(err)
  }
}

module.exports = {
  getAllPacks,
  removePack,
  removeAssetType,
  addPack,
  editPack,
  addAssetType,
  editAssetType,
  getPackByTitle
}