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
function getAllProjectsQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."project"`,
        };
        return yield db.query(query);
    });
}
function getProjectByIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."project" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
function addProjectQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        return yield db.query(query);
    });
}
function editProjectQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.project_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'project_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."project" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function removeProjectQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `delete from public."project" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getAllProjectsQuery,
    getProjectByIdQuery,
    addProjectQuery,
    editProjectQuery,
    removeProjectQuery
};
