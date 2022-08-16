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
const { getAllPacksQuery, removePackQuery, addPackQuery, editPackQuery, getPackByTitleQuery } = require('../queries/packs');
const { getAllAssetTypesQuery, removeAssetTypeQuery, addAssetTypeQuery, editAssetTypeQuery, getAssetTypesByPackIdQuery } = require('../queries/assetTypes');
function getAllPacks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packData = yield getAllPacksQuery();
            const assetTypeData = yield getAllAssetTypesQuery();
            for (var pack of packData.rows) {
                pack['asset_types'] = assetTypeData.rows.filter(assetType => assetType.pack_id === pack.id);
            }
            res.send(packData.rows);
        }
        catch (err) {
            next(err);
        }
    });
}
function getPackByTitle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packData = yield getPackByTitleQuery(req.body.pack_title);
            const pack = packData.rows[0];
            const assetTypeData = yield getAssetTypesByPackIdQuery(pack.id);
            pack.asset_types = assetTypeData.rows;
            res.send(pack);
        }
        catch (err) {
            next(err);
        }
    });
}
function addPack(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packData = yield addPackQuery(req.body);
            res.status(201).json(packData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editPack(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packData = yield editPackQuery(req.body);
            res.send(packData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function removePack(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield removePackQuery(req.body.pack_id);
            res.send({ message: `Successfully removed pack: ${req.body.pack_id}` });
        }
        catch (err) {
            next(err);
        }
    });
}
function addAssetType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assetData = yield addAssetTypeQuery(req.body);
            res.status(201).json(assetData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editAssetType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assetData = yield editAssetTypeQuery(req.body);
            res.send(assetData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeAssetType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield removeAssetTypeQuery(req.body.asset_type_id);
            res.send({ message: `Successfully asset Type: ${req.body.asset_type_id}` });
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getAllPacks,
    removePack,
    removeAssetType,
    addPack,
    editPack,
    addAssetType,
    editAssetType,
    getPackByTitle
};
