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
function getContributionByIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."contribution" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
function getContributionsByUserIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."contribution" where user_id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
function getAllContributionsQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."contribution"`,
        };
        return yield db.query(query);
    });
}
function addContributionQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        return yield db.query(query);
    });
}
function editContributionQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.contribution_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'contribution_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."contribution" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
module.exports = {
    getContributionByIdQuery,
    getContributionsByUserIdQuery,
    getAllContributionsQuery,
    addContributionQuery,
    editContributionQuery
};
