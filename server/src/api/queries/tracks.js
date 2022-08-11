const db = require('../../dbconfig')
const {getUserByUsernameQuery} = require('../queries/users')

async function getTrackAssetByIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."track_asset" where id = $1`,
    values: [id],
  }
  return await db.query(query)
}

async function addTrackAssetQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."track_asset" (
        name,
        uuid,
        author_id,
        length,
        waveform
      ) values($1,$2,$3,$4,$5)
      returning *
    `,
    values: [
      data.name,
      data.uuid,
      data.author_id,
      data.length,
      data.waveform
    ]
  }
  return await db.query(query)
}

async function getTrackAssetsByKeywordQuery({keyword, username, limit, offset}) {
  let query = {
    text: /*sql*/ `select * from public."track_asset" where position($1 in lower(name))>0 or $1=any(metadata) order by name COLLATE "numeric" limit $2 offset $3`,
    values: [keyword, limit, offset],
  }
  if(username) {
    // by author id
    const userData = await getUserByUsernameQuery(username)
    const user = userData.rows[0]
    query = {
      text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (author_id = $2) order by name COLLATE "numeric" limit $3 offset $4`,
      values: [keyword, user.id, limit, offset],
    }
  }
  return await db.query(query)
}

async function getTrackAssetsByDoubleKeywordQuery({keyword1, keyword2, username, limit, offset}) {
  let query = {
    text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (position($2 in lower(name))>0 or $2=any(metadata)) order by name COLLATE "numeric" limit $3 offset $4`,
    values: [keyword1, keyword2, limit, offset]
  }
  if(username) {
    // by author id
    const userData = await getUserByUsernameQuery(username)
    const user = userData.rows[0]
    query = {
      text: /*sql*/ `select * from public."track_asset" where ((position($1 in lower(name))>0 or $1=any(metadata)) and (position($2 in lower(name))>0 or $2=any(metadata))) and (author_id = $3) order by name COLLATE "numeric" limit $4 offset $5`,
      values: [keyword1, keyword2, user.id, limit, offset]
    }
  }
  return await db.query(query)
}

async function getTrackAssetsByDownloadsQuery({username, limit, offset}) {
  let query = {
    text: /*sql*/ `select * from public."track_asset" order by downloads desc limit $1 offset $2`,
    values: [limit, offset]
  }
  if(username) {
    // by author id
    const userData = await getUserByUsernameQuery(username)
    const user = userData.rows[0]
    query = {
      text: /*sql*/ `select * from public."track_asset" where (author_id = $1) order by downloads desc limit $2 offset $3`,
      values: [user.id, limit, offset]
    }
  }

  return await db.query(query)
}

async function getTrackAssetsByDownloadsAndKeywordQuery({keyword, username, limit, offset}) {
  let query = {
    text: /*sql*/ `select * from public."track_asset" where position($1 in lower(name))>0 or $1=any(metadata) order by downloads desc limit $2 offset $3`,
    values: [keyword, limit, offset]
  }
  if(username) {
    // by author id
    const userData = await getUserByUsernameQuery(username)
    const user = userData.rows[0]
    query = {
      text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (author_id = $2) order by downloads desc limit $3 offset $4`,
      values: [keyword, user.id, limit, offset]
    }
  } 

  return await db.query(query)
}

async function getAllTrackAssetsQuery({username, limit, offset}) {
  let query = {
    text: /*sql*/ `select * from public."track_asset" order by name COLLATE "numeric" limit $1 offset $2`,
    values: [limit, offset]
  }
  if(username) {
    // by author id
    const userData = await getUserByUsernameQuery(username)
    const user = userData.rows[0]
    query = {
      text: /*sql*/ `select * from public."track_asset" where (author_id = $1) order by name COLLATE "numeric" limit $2 offset $3`,
      values: [user.id, limit, offset]
    }
  }

  return await db.query(query)
}

async function editTrackAssetQuery(data) {
  const id = data.track_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'track_id') continue
    
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."track_asset" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function removeTrackAssetQuery(id) {
  const query = {
    text: /*sql*/ `delete from public."track_asset" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

module.exports = {
  getTrackAssetByIdQuery,
  addTrackAssetQuery,
  getAllTrackAssetsQuery,
  getTrackAssetsByKeywordQuery,
  getTrackAssetsByDownloadsQuery,
  getTrackAssetsByDownloadsAndKeywordQuery,
  getTrackAssetsByDoubleKeywordQuery,
  editTrackAssetQuery,
  removeTrackAssetQuery
}