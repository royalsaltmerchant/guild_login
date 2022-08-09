const { 
  getEntryByIdQuery,
  removeEntryQuery,
  addEntryQuery,
  editEntryQuery
 } = require('../queries/entries')

 async function getEntryById(req, res, next) {
  try {
    const entryData = await getEntryByIdQuery(req.body.entry_id)

    res.send(entryData.rows[0])
  } catch(err) {
    next(err)
  }
 }

 async function addEntry(req, res, next) {
  try {
    const entryData = await addEntryQuery(req.body)
    res.status(201).json(entryData.rows[0])
  } catch(err) {
    next(err)
  }
}

async function editEntry(req, res, next) {
  try {
    const entryData = await editEntryQuery(req.body)
    res.send(entryData.rows[0])
  } catch(err) {
    next(err)
  }
}

 async function removeEntry(req, res, next) {
  try {
    await removeEntryQuery(req.body.entry_id)
    res.send({message: `Successfully removed entry: ${req.body.entry_id}`})
  } catch(err) {
    next(err)
  }
}

 module.exports = {
  getEntryById,
  removeEntry,
  addEntry,
  editEntry
}