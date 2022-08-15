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
const { getAllProjectsQuery, getProjectByIdQuery, addProjectQuery, editProjectQuery, removeProjectQuery } = require('../queries/projects');
const { getAllEntriesQuery } = require('../queries/entries');
const { getAllContributionsQuery } = require('../queries/contributions');
function getAllProjects(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectData = yield getAllProjectsQuery();
            const entryData = yield getAllEntriesQuery();
            const contributionData = yield getAllContributionsQuery();
            for (var project of projectData.rows) {
                project['entries'] = entryData.rows.filter(entry => entry.project_id === project.id);
            }
            for (var project of projectData.rows) {
                for (var entry of project['entries']) {
                    entry.contributions = contributionData.rows.filter(contribution => contribution.entry_id === entry.id);
                }
            }
            res.send(projectData.rows);
        }
        catch (err) {
            next(err);
        }
    });
}
function getProjectById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectData = yield getProjectByIdQuery(req.body.project_id);
            res.send(projectData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function addProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectData = yield addProjectQuery(req.body);
            res.status(201).json(projectData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function editProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectData = yield editProjectQuery(req.body);
            res.send(projectData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function removeProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield removeProjectQuery(req.body.project_id);
            res.send({ message: `Successfully removed project: ${req.body.project_id}` });
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getAllProjects,
    getProjectById,
    addProject,
    editProject,
    removeProject
};
