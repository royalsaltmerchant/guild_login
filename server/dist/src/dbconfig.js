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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
var credentials = {
    user: process.env.AUDIOGUILD_POSTGRES_USER,
    host: process.env.AUDIOGUILD_DATABASE_URL,
    database: process.env.AUDIOGUILD_DATABASE_DB,
    password: process.env.AUDIOGUILD_POSTGRES_PW,
    port: parseInt(process.env.DB_PORT || "5432")
};
var pool = new pg_1.Pool(credentials);
module.exports = {
    query(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const res = yield pool.query(queryString);
            const duration = Date.now() - start;
            console.log('executed query', { queryString, duration, rows: res.rowCount });
            return res;
        });
    },
};
