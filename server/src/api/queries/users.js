const db = require('../../dbconfig')

async function getUserByIdQuery(id) {
  const query = {
    text: /*sql*/ `select * from public."user" where id = $1`,
    values: [id],
  }
  return await db.query(query)
}

async function getAllUsersQuery() {
  const query = {
    text: /*sql*/ `select * from public."user"`,
  }
  return await db.query(query)
}

async function getUserByUsernameQuery(username) {
  const query = {
    text: /*sql*/ `select * from public."user" where username = $1`,
    values: [username],
  }
  return await db.query(query)
}

async function getUserByEmailQuery(email) {
  const query = {
    text: /*sql*/ `select * from public."user" where email = $1`,
    values: [email],
  }
  return await db.query(query)
}

async function registerUserQuery({username, email, first_name, last_name, password}) {
  const query = {
    text: /*sql*/ `
      insert into public."user" (
        username, 
        email, 
        first_name, 
        last_name, 
        password
      ) values($1,$2,$3,$4,$5)
      RETURNING *
    `,
    values: [
      username, 
      email, 
      first_name, 
      last_name, 
      password
    ],
  }

  return await db.query(query)
}

async function editUserQuery(data) {
  const id = data.user_id
  let edits = ``
  let values = []
  let iterator = 1

  for(const [key, value] of Object.entries(data)) {
    if(key === 'user_id') continue
    
    edits += `${key} = $${iterator}, `;
    values.push(value)
    iterator++
  }

  edits = edits.slice(0, -2)
  values.push(id)

  const query = {
    text: /*sql*/ `update public."user" set ${edits} where id = $${iterator} returning *`,
    values: values,
  }

  return await db.query(query)
}

async function editUserPasswordQuery(id, password) {
  const query = {
    text: /*sql*/ `update public."user" set password = $2 where id = $1 returning *`,
    values: [id, password]
  }

  return await db.query(query)
}

module.exports = {
  getAllUsersQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  getUserByEmailQuery,
  registerUserQuery,
  editUserQuery,
  editUserPasswordQuery
}