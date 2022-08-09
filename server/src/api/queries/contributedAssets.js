const db = require('../../dbconfig')

async function getContributedAssetsByContributionIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."contributed_asset" where contribution_id = $1`,
    values: [id]
  }
  return await db.query(query)
}

async function getAllContributedAssetsQuery() {
  const query = {
    text: /*sql*/ `select * from public."contributed_asset"`
  }
  return await db.query(query)
}

async function addContributedAssetQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."contributed_asset" (
        contribution_id,
        name,
        uuid
      ) values($1,$2,$3)
      returning *
    `,
    values: [
      data.contribution_id,
      data.name,
      data.uuid
    ]
  }
  return await db.query(query)
}

async function editContributedAssetQuery(data) {
  const id = data.contributed_asset_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'contributed_asset_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."contributed_asset" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

module.exports = {
  getAllContributedAssetsQuery,
  getContributedAssetsByContributionIdQuery,
  addContributedAssetQuery,
  editContributedAssetQuery
}