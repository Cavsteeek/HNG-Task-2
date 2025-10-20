// routes.js
import express from 'express';
import {
    createString,
    getString,
    getAllStrings,
    deleteString,
    naturalLanguageFilter
} from './controller.js';

const router = express.Router();

router.post('/strings', createString);
router.get('/strings/:string_value', getString);
router.get('/strings', getAllStrings);
router.get('/strings/filter-by-natural-language', naturalLanguageFilter);
router.delete('/strings/:string_value', deleteString);

export default router;
