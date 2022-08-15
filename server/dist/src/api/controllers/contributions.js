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
const { getContributionByIdQuery, addContributionQuery, editContributionQuery } = require('../queries/contributions');
const { addContributedAssetQuery, getContributedAssetsByContributionIdQuery, editContributedAssetQuery } = require('../queries/contributedAssets');
function getContributionById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contributionData = yield getContributionByIdQuery(req.body.contribution_id);
            const contributedAssetsData = yield getContributedAssetsByContributionIdQuery(req.body.contribution_id);
            const data = contributionData.rows[0];
            data.contributed_assets = contributedAssetsData.rows;
            res.send(data);
        }
        catch (err) {
            next(err);
        }
    });
}
function addContribution(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contributionData = yield addContributionQuery(req.body);
            res.status(201).json(contributionData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editContribution(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contributionData = yield editContributionQuery(req.body);
            res.send(contributionData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function addContributedAsset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assetData = yield addContributedAssetQuery(req.body);
            res.status(201).json(assetData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editContributedAsset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assetData = yield editContributedAssetQuery(req.body);
            res.send(assetData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getContributionById,
    addContribution,
    addContributedAsset,
    editContribution,
    editContributedAsset
};
