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
const WaveFile = require('wavefile').WaveFile;
const { addTrackAssetQuery, getTrackAssetsByKeywordQuery, getTrackAssetsByDownloadsQuery, getAllTrackAssetsQuery, getTrackAssetsByDownloadsAndKeywordQuery, getTrackAssetsByDoubleKeywordQuery, editTrackAssetQuery, getTrackAssetByIdQuery, removeTrackAssetQuery } = require('../queries/tracks');
const { getUserByIdQuery, editUserQuery } = require('../queries/users');
function addTrackAsset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, author_id, uuid } = req.body;
            const audio = req.files[0];
            wav = new WaveFile();
            wav.fromBuffer(audio.buffer);
            // calc length 
            const sampleRate = wav.fmt.sampleRate;
            const samples = wav.getSamples(true, Int32Array);
            const length = (samples.length / sampleRate).toFixed(2);
            // get samples for waveform UI
            const samplesDesired = 1000;
            const samplesResults = [];
            const delta = Math.floor(samples.length / samplesDesired);
            for (i = 0; i < samples.length; i = i + delta) {
                samplesResults.push(samples[i]);
            }
            // create new track
            const data = {
                name,
                uuid,
                author_id,
                waveform: samplesResults,
                length
            };
            const trackData = yield addTrackAssetQuery(data);
            // increment author upload count
            const userData = yield getUserByIdQuery(author_id);
            const count = parseInt(userData.rows[0].upload_count);
            const newCount = count + 1;
            yield editUserQuery({ user_id: author_id, upload_count: newCount });
            res.status(201).json(trackData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function getTrackAssets(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tracks = [];
            if (req.body.filter) {
                if (req.body.filter === "popular") {
                    if (req.body.query) {
                        const trackData = yield getTrackAssetsByDownloadsAndKeywordQuery({
                            keyword: req.body.query,
                            username: req.params.username,
                            limit: req.body.limit,
                            offset: req.body.offset
                        });
                        tracks.push(...trackData.rows);
                    }
                    else {
                        const trackData = yield getTrackAssetsByDownloadsQuery({
                            username: req.params.username,
                            limit: req.body.limit,
                            offset: req.body.offset
                        });
                        tracks.push(...trackData.rows);
                    }
                }
                else {
                    if (req.body.query) {
                        const trackData = yield getTrackAssetsByDoubleKeywordQuery({
                            keyword1: req.body.filter,
                            keyword2: req.body.query,
                            username: req.params.username,
                            limit: req.body.limit,
                            offset: req.body.offset
                        });
                        tracks.push(...trackData.rows);
                    }
                    else {
                        const trackData = yield getTrackAssetsByKeywordQuery({
                            keyword: req.body.filter,
                            username: req.params.username,
                            limit: req.body.limit,
                            offset: req.body.offset
                        });
                        tracks.push(...trackData.rows);
                    }
                }
            }
            if (!req.body.filter && req.body.query) {
                const trackData = yield getTrackAssetsByKeywordQuery({
                    keyword: req.body.query,
                    username: req.params.username,
                    limit: req.body.limit,
                    offset: req.body.offset
                });
                tracks.push(...trackData.rows);
            }
            if (!req.body.filter && !req.body.query) {
                const trackData = yield getAllTrackAssetsQuery({
                    username: req.params.username,
                    limit: req.body.limit,
                    offset: req.body.offset
                });
                tracks.push(...trackData.rows);
            }
            const results = {
                tracks: tracks,
                track_count: tracks.length,
                // remaining_amount: tracks.length - (req.body.offset + req.body.limit),
                offset: req.body.offset,
                amount: req.body.limit
            };
            res.send(results);
        }
        catch (err) {
            next(err);
        }
    });
}
function editTrackAsset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const metadata = () => __awaiter(this, void 0, void 0, function* () {
                if (req.body.add_tag) {
                    const trackData = yield getTrackAssetByIdQuery(req.body.track_id);
                    const trackMetadata = trackData.rows[0].metadata;
                    trackMetadata.push(req.body.add_tag);
                    return trackMetadata;
                }
                else if (req.body.remove_tag) {
                    const trackData = yield getTrackAssetByIdQuery(req.body.track_id);
                    return trackData.rows[0].metadata.filter(data => data !== req.body.remove_tag);
                }
                else
                    return null;
            });
            const data = {
                track_id: req.body.track_id
            };
            if (req.body.downloads)
                data.downloads = req.body.downloads;
            if (yield metadata())
                data.metadata = yield metadata();
            const editTrackData = yield editTrackAssetQuery(data);
            res.send(editTrackData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeTrackAsset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackData = yield getTrackAssetByIdQuery(req.body.track_id);
            // decrement author upload count
            const userData = yield getUserByIdQuery(trackData.rows[0].author_id);
            const count = parseInt(userData.rows[0].upload_count);
            const newCount = count - 1;
            yield editUserQuery({ user_id: userData.rows[0].id, upload_count: newCount });
            yield removeTrackAssetQuery(req.body.track_id);
            res.send({ message: `Successfully removed track: ${req.body.track_id}` });
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    addTrackAsset,
    getTrackAssets,
    editTrackAsset,
    removeTrackAsset
};
