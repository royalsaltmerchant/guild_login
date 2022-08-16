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
function getAssetTypesByPackIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."asset_type" where pack_id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
function getAllAssetTypesQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."asset_type"`
        };
        return yield db.query(query);
    });
}
function addAssetTypeQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `
      insert into public."asset_type" (
        pack_id,
        description
      ) values($1,$2)
      returning *
    `,
            values: [
                data.pack_id,
                data.description
            ]
        };
        return yield db.query(query);
    });
}
function editAssetTypeQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.asset_type_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'asset_type_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."asset_type" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function removeAssetTypeQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `delete from public."asset_type" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getAssetTypesByPackIdQuery,
    getAllAssetTypesQuery,
    addAssetTypeQuery,
    editAssetTypeQuery,
    removeAssetTypeQuery
};
