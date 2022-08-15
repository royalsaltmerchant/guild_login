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
function getAllEntriesQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."entry"`,
        };
        return yield db.query(query);
    });
}
function getEntryByIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."entry" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
function addEntryQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        return yield db.query(query);
    });
}
function editEntryQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.entry_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'entry_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."entry" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function removeEntryQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `delete from public."entry" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getAllEntriesQuery,
    getEntryByIdQuery,
    removeEntryQuery,
    addEntryQuery,
    editEntryQuery
};
