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
function getAllPacksQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."pack"`,
        };
        return yield db.query(query);
    });
}
function getPackByTitleQuery(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."pack" where title = $1`,
            values: [title],
        };
        return yield db.query(query);
    });
}
function addPackQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        return yield db.query(query);
    });
}
function editPackQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.pack_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'pack_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."pack" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function removePackQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `delete from public."pack" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getAllPacksQuery,
    removePackQuery,
    addPackQuery,
    editPackQuery,
    getPackByTitleQuery
};
