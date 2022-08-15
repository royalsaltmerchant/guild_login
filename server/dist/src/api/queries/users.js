"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const db = require('../../dbconfig');
function getUserByIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."user" where id = $1`,
            values: [id],
        };
        return yield db.query(query);
    });
}
function getAllUsersQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."user"`,
        };
        return yield db.query(query);
    });
}
function getUserByUsernameQuery(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."user" where username = $1`,
            values: [username],
        };
        return yield db.query(query);
    });
}
function getUserByEmailQuery(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."user" where email = $1`,
            values: [email],
        };
        return yield db.query(query);
    });
}
function registerUserQuery({ username, email, first_name, last_name, password }) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        return yield db.query(query);
    });
}
function editUserQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.user_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'user_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."user" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function editUserPasswordQuery(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `update public."user" set password = $2 where id = $1 returning *`,
            values: [id, password]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getAllUsersQuery,
    getUserByIdQuery,
    getUserByUsernameQuery,
    getUserByEmailQuery,
    registerUserQuery,
    editUserQuery,
    editUserPasswordQuery
};
