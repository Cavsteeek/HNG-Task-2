// controller.js
import { analyzeString } from './utils.js';

// temporary storage (acts like a database)
const stringStore = new Map();

export const createString = (req, res) => {
    const { value } = req.body;

    if (typeof value !== 'string') {
        return res.status(422).json({ error: 'Value must be a string.' });
    }
    if (!value) {
        return res.status(400).json({ error: 'Missing "value" field.' });
    }

    const analysis = analyzeString(value);
    if (stringStore.has(analysis.sha256_hash)) {
        return res.status(409).json({ error: 'String already exists.' });
    }

    const record = {
        id: analysis.sha256_hash,
        value,
        properties: analysis,
        created_at: new Date().toISOString()
    };

    stringStore.set(analysis.sha256_hash, record);
    res.status(201).json(record);
};

export const getString = (req, res) => {
    const { string_value } = req.params;

    for (const record of stringStore.values()) {
        if (record.value === string_value) {
            return res.json(record);
        }
    }

    return res.status(404).json({ error: 'String not found.' });
};

export const getAllStrings = (req, res) => {
    try {
        // Convert the in-memory Map or Object into an array
        let results = [...stringStore.values()];

        const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

        // Validate is_palindrome (must be 'true' or 'false' if provided)
        if (is_palindrome !== undefined && !['true', 'false'].includes(is_palindrome)) {
            return res.status(400).json({ error: "Invalid value for 'is_palindrome'. Must be 'true' or 'false'." });
        }

        // Validate numeric filters (if provided, they must be valid numbers)
        if (min_length !== undefined && isNaN(Number(min_length))) {
            return res.status(400).json({ error: "Invalid value for 'min_length'. Must be a number." });
        }

        if (max_length !== undefined && isNaN(Number(max_length))) {
            return res.status(400).json({ error: "Invalid value for 'max_length'. Must be a number." });
        }

        if (word_count !== undefined && isNaN(Number(word_count))) {
            return res.status(400).json({ error: "Invalid value for 'word_count'. Must be a number." });
        }

        // Validate contains_character (must be a single character if provided)
        if (contains_character !== undefined && contains_character.length !== 1) {
            return res.status(400).json({ error: "Invalid value for 'contains_character'. Must be a single character." });
        }


        if (is_palindrome !== undefined) {
            const boolVal = is_palindrome === 'true';
            results = results.filter(r => r.properties.is_palindrome === boolVal);
        }

        if (min_length) results = results.filter(r => r.properties.length >= Number(min_length));
        if (max_length) results = results.filter(r => r.properties.length <= Number(max_length));
        if (word_count) results = results.filter(r => r.properties.word_count === Number(word_count));
        if (contains_character) results = results.filter(r => r.value.includes(contains_character));

        res.json({
            data: results,
            count: results.length,
            filters_applied: req.query
        });
    } catch (err) {
        // Catch unexpected errors
        res.status(400).json({ error: "Invalid query parameter values or types" });
    }
};

export const deleteString = (req, res) => {
    const { string_value } = req.params;

    for (const [hash, record] of stringStore.entries()) {
        if (record.value === string_value) {
            stringStore.delete(hash);
            return res.status(204).send();
        }
    }

    res.status(404).json({ error: 'String not found.' });
};

// simple natural language parsing
export const naturalLanguageFilter = (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Missing query parameter.' });

    let filters = {};

    const lower = query.toLowerCase();

    if (lower.includes('palindromic')) filters.is_palindrome = true;
    if (lower.includes('single word')) filters.word_count = 1;
    if (lower.includes('longer than')) {
        const match = lower.match(/longer than (\d+)/);
        if (match) filters.min_length = Number(match[1]) + 1;
    }
    if (lower.includes('containing the letter')) {
        const match = lower.match(/letter (\w)/);
        if (match) filters.contains_character = match[1];
    }

    if (Object.keys(filters).length === 0) {
        return res.status(400).json({ error: 'Unable to parse natural language query' });
    }

    let results = [...stringStore.values()];
    if (filters.is_palindrome) results = results.filter(r => r.properties.is_palindrome);
    if (filters.word_count) results = results.filter(r => r.properties.word_count === filters.word_count);
    if (filters.min_length) results = results.filter(r => r.properties.length >= filters.min_length);
    if (filters.contains_character) results = results.filter(r => r.value.includes(filters.contains_character));

    res.json({
        data: results,
        count: results.length,
        interpreted_query: {
            original: query,
            parsed_filters: filters
        }
    });
};
