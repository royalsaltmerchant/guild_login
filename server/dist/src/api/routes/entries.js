"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getEntryById, addEntry, editEntry, removeEntry } = require('../controllers/entries');
var router = express.Router();
router.post('/get_entry', getEntryById);
router.post('/remove_entry', removeEntry);
router.post('/add_entry', addEntry);
router.post('/edit_entry', editEntry);
exports.default = router;
