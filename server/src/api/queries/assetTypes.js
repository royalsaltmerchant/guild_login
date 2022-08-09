const db = require('../../dbconfig')

async function getAssetTypesByPackIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."asset_type" where pack_id = $1`,
    values: [id]
  }
  return await db.query(query)
}

async function getAllAssetTypesQuery() {
  const query = {
    text: /*sql*/ `select * from public."asset_type"`
  }
  return await db.query(query)
}

async function addAssetTypeQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."asset_type" (
        pack_id,
        description
      ) values($1,$2)
      returning *
    `,
    values: [
      data.pack_id,
      data.description
    ]
  }
  return await db.query(query)
}

async function editAssetTypeQuery(data) {
  const id = data.asset_type_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'asset_type_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."asset_type" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function removeAssetTypeQuery(id) {
  const query = {
    text: /*sql*/ `delete from public."asset_type" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

module.exports = {
  getAssetTypesByPackIdQuery,
  getAllAssetTypesQuery,
  addAssetTypeQuery,
  editAssetTypeQuery,
  removeAssetTypeQuery
}