const db = require('../../dbconfig')

async function getAllPacksQuery() {
  const query = {
    text: /*sql*/ `select * from public."pack"`,
  }
  return await db.query(query)
}

async function getPackByTitleQuery(title) {
  const query = {
    text: /*sql*/ `select * from public."pack" where title = $1`,
    values: [title],
  }
  return await db.query(query)
}

async function addPackQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."pack" (
        title,
        description,
        image_file,
        video_file,
        coin_cost
      ) values($1,$2,$3,$4,$5)
      returning *
    `,
    values: [
      data.title,
      data.description,
      data.image_file,
      data.video_file,
      data.coin_cost
    ]
  }
  return await db.query(query)
}

async function editPackQuery(data) {
  const id = data.pack_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'pack_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."pack" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function removePackQuery(id) {
  const query = {
    text: /*sql*/ `delete from public."pack" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

module.exports = {
  getAllPacksQuery,
  removePackQuery,
  addPackQuery,
  editPackQuery,
  getPackByTitleQuery
}