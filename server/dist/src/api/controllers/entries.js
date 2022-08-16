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
const { getEntryByIdQuery, removeEntryQuery, addEntryQuery, editEntryQuery } = require('../queries/entries');
function getEntryById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const entryData = yield getEntryByIdQuery(req.body.entry_id);
            res.send(entryData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function addEntry(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const entryData = yield addEntryQuery(req.body);
            res.status(201).json(entryData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editEntry(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const entryData = yield editEntryQuery(req.body);
            res.send(entryData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeEntry(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield removeEntryQuery(req.body.entry_id);
            res.send({ message: `Successfully removed entry: ${req.body.entry_id}` });
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getEntryById,
    removeEntry,
    addEntry,
    editEntry
};
