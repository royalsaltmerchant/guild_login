const db = require('../../dbconfig')

async function getContributionByIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."contribution" where id = $1`,
    values: [id]
  }
  return await db.query(query)
}

async function getContributionsByUserIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."contribution" where user_id = $1`,
    values: [id]
  }
  return await db.query(query)
}

async function getAllContributionsQuery() {
  const query = {
    text: /*sql*/ `select * from public."contribution"`,
  }
  return await db.query(query)
}

async function addContributionQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."contribution" (
        entry_id,
        project_id,
        user_id,
        amount
      ) values($1,$2,$3,$4)
      returning *
    `,
    values: [
      data.entry_id,
      data.project_id,
      data.user_id,
      data.amount
    ]
  }
  return await db.query(query)
}

async function editContributionQuery(data) {
  const id = data.contribution_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'contribution_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."contribution" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

module.exports = {
  getContributionByIdQuery,
  getContributionsByUserIdQuery,
  getAllContributionsQuery,
  addContributionQuery,
  editContributionQuery
}