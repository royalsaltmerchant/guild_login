const db = require('../../dbconfig')

async function getAllProjectsQuery() {
  const query = {
    text: /*sql*/ `select * from public."project"`,
  }
  return await db.query(query)
}

async function getProjectByIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."project" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

async function addProjectQuery(data) {
  const query = {
    text: /*sql*/ `
      insert into public."project" (
        title,
        description,
        image_file
      ) values($1,$2,$3)
      returning *
    `,
    values: [
      data.title,
      data.description,
      data.image_file,
    ]
  }
  return await db.query(query)
}

async function editProjectQuery(data) {
  const id = data.project_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'project_id') continue
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."project" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function removeProjectQuery(id) {
  const query = {
    text: /*sql*/ `delete from public."project" where id = $1`,
    values: [id]
  }

  return await db.query(query)
}

module.exports = {
  getAllProjectsQuery,
  getProjectByIdQuery,
  addProjectQuery,
  editProjectQuery,
  removeProjectQuery
}