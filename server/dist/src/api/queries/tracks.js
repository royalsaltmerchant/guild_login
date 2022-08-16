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
const { getUserByUsernameQuery } = require('../queries/users');
function getTrackAssetByIdQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `select * from public."track_asset" where id = $1`,
            values: [id],
        };
        return yield db.query(query);
    });
}
function addTrackAssetQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `
      insert into public."track_asset" (
        name,
        uuid,
        author_id,
        length,
        waveform
      ) values($1,$2,$3,$4,$5)
      returning *
    `,
            values: [
                data.name,
                data.uuid,
                data.author_id,
                data.length,
                data.waveform
            ]
        };
        return yield db.query(query);
    });
}
function getTrackAssetsByKeywordQuery({ keyword, username, limit, offset }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            text: /*sql*/ `select * from public."track_asset" where position($1 in lower(name))>0 or $1=any(metadata) order by name COLLATE "numeric" limit $2 offset $3`,
            values: [keyword, limit, offset],
        };
        if (username) {
            // by author id
            const userData = yield getUserByUsernameQuery(username);
            const user = userData.rows[0];
            query = {
                text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (author_id = $2) order by name COLLATE "numeric" limit $3 offset $4`,
                values: [keyword, user.id, limit, offset],
            };
        }
        return yield db.query(query);
    });
}
function getTrackAssetsByDoubleKeywordQuery({ keyword1, keyword2, username, limit, offset }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (position($2 in lower(name))>0 or $2=any(metadata)) order by name COLLATE "numeric" limit $3 offset $4`,
            values: [keyword1, keyword2, limit, offset]
        };
        if (username) {
            // by author id
            const userData = yield getUserByUsernameQuery(username);
            const user = userData.rows[0];
            query = {
                text: /*sql*/ `select * from public."track_asset" where ((position($1 in lower(name))>0 or $1=any(metadata)) and (position($2 in lower(name))>0 or $2=any(metadata))) and (author_id = $3) order by name COLLATE "numeric" limit $4 offset $5`,
                values: [keyword1, keyword2, user.id, limit, offset]
            };
        }
        return yield db.query(query);
    });
}
function getTrackAssetsByDownloadsQuery({ username, limit, offset }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            text: /*sql*/ `select * from public."track_asset" order by downloads desc limit $1 offset $2`,
            values: [limit, offset]
        };
        if (username) {
            // by author id
            const userData = yield getUserByUsernameQuery(username);
            const user = userData.rows[0];
            query = {
                text: /*sql*/ `select * from public."track_asset" where (author_id = $1) order by downloads desc limit $2 offset $3`,
                values: [user.id, limit, offset]
            };
        }
        return yield db.query(query);
    });
}
function getTrackAssetsByDownloadsAndKeywordQuery({ keyword, username, limit, offset }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            text: /*sql*/ `select * from public."track_asset" where position($1 in lower(name))>0 or $1=any(metadata) order by downloads desc limit $2 offset $3`,
            values: [keyword, limit, offset]
        };
        if (username) {
            // by author id
            const userData = yield getUserByUsernameQuery(username);
            const user = userData.rows[0];
            query = {
                text: /*sql*/ `select * from public."track_asset" where (position($1 in lower(name))>0 or $1=any(metadata)) and (author_id = $2) order by downloads desc limit $3 offset $4`,
                values: [keyword, user.id, limit, offset]
            };
        }
        return yield db.query(query);
    });
}
function getAllTrackAssetsQuery({ username, limit, offset }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            text: /*sql*/ `select * from public."track_asset" order by name COLLATE "numeric" limit $1 offset $2`,
            values: [limit, offset]
        };
        if (username) {
            // by author id
            const userData = yield getUserByUsernameQuery(username);
            const user = userData.rows[0];
            query = {
                text: /*sql*/ `select * from public."track_asset" where (author_id = $1) order by name COLLATE "numeric" limit $2 offset $3`,
                values: [user.id, limit, offset]
            };
        }
        return yield db.query(query);
    });
}
function editTrackAssetQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = data.track_id;
        let edits = ``;
        let values = [];
        let iterator = 1;
        for (const [key, value] of Object.entries(data)) {
            if (key === 'track_id')
                continue;
            edits += `${key} = $${iterator}, `;
            values.push(value);
            iterator++;
        }
        edits = edits.slice(0, -2);
        values.push(id);
        const query = {
            text: /*sql*/ `update public."track_asset" set ${edits} where id = $${iterator} returning *`,
            values: values,
        };
        return yield db.query(query);
    });
}
function removeTrackAssetQuery(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            text: /*sql*/ `delete from public."track_asset" where id = $1`,
            values: [id]
        };
        return yield db.query(query);
    });
}
module.exports = {
    getTrackAssetByIdQuery,
    addTrackAssetQuery,
    getAllTrackAssetsQuery,
    getTrackAssetsByKeywordQuery,
    getTrackAssetsByDownloadsQuery,
    getTrackAssetsByDownloadsAndKeywordQuery,
    getTrackAssetsByDoubleKeywordQuery,
    editTrackAssetQuery,
    removeTrackAssetQuery
};
