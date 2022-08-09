const db = require('../../dbconfig')

async function getAllEntriesQuery() {
  const query = {
    text: /*sql*/ `select * from public."entry"`,
  }
  return await db.query(query)
}

async function getEntryByIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."entry" where id = $1`,
    values: [id]
  }
  return await db.query(query)
}

async function addEntryQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."entry" (
        project_id,
        title,
        description,
        amount
      ) values($1,$2,$3,$4)
      returning *
    `,
    values: [
      data.project_id,
      data.title,
      data.description,
      data.amount
    ]
  }
  return await db.query(query)
}

async function editEntryQuery(data) {
  const id = data.entry_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'entry_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."entry" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function removeEntryQuery(id) {
  const query = {
    text: /*sql*/ `delete from public."entry" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

module.exports = {
  getAllEntriesQuery,
  getEntryByIdQuery,
  removeEntryQuery,
  addEntryQuery,
  editEntryQuery
}