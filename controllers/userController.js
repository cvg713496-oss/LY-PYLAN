const db = require('../config/db');

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) { return res.status(400).json({ message: "Name and email are required!" }); }
        const query = "INSERT INTO users (name, email) VALUES (?, ?)";
        const [result] = await db.query(query, [name, email]);
        res.status(201).json({ message: "User created successfully!", userId: result.insertId });
    } catch (error) { res.status(500).json({ message: "Server Error", error: error.message }); }
};

const getUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ message: "Server Error", error: error.message }); }
};

const getProvinces = async (req, res) => {
    try {
        const query = "SELECT * FROM province";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) { res.status(500).json({ message: "Server Error", error: error.message }); }
};

const getProvinceById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM province WHERE id = ?"; 
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) { return res.status(404).json({ success: false, message: "Not found!" }); }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: "Server Error", error: error.message }); }
};

const getPeople = async (req, res) => {
    try {
        const query = `
            SELECT people.id, people.surname, people.givenname, people.dob, people.gender, province.provincename_kh
            FROM people LEFT JOIN province ON people.province_id = province.id ORDER BY people.id DESC
        `; 
        const [rows] = await db.query(query);
        res.status(200).json({ success: true, total: rows.length, data: rows });
    } catch (error) { res.status(500).json({ success: false, message: "Server Error", error: error.message }); }
};

const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = `
            SELECT people.id, people.surname, people.givenname, people.dob, people.gender, province.provincename_kh 
            FROM people LEFT JOIN province ON people.province_id = province.id WHERE people.id = ?
        `; 
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) { return res.status(404).json({ success: false, message: "Not found!" }); }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: "Server Error", error: error.message }); }
};

const createPerson = async (req, res) => {
    try {
        const { surname, givenname, dob, gender, province_id } = req.body;
        const query = "INSERT INTO people (surname, givenname, dob, gender, province_id) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [surname, givenname, dob, gender, province_id]);
        res.status(201).json({ success: true, message: "Person created successfully!", insertId: result.insertId });
    } catch (error) { res.status(500).json({ success: false, message: "Server Error", error: error.message }); }
};

const searchPeople = async (req, res) => {
    try {
        const keyword = req.query.q || ''; 
        const searchPattern = `%${keyword}%`;
        const query = `
            SELECT people.id, people.surname, people.givenname, people.dob, people.gender, province.provincename_kh
            FROM people LEFT JOIN province ON people.province_id = province.id
            WHERE people.surname LIKE ? OR people.givenname LIKE ? ORDER BY people.id DESC
        `; 
        const [rows] = await db.query(query, [searchPattern, searchPattern]);
        res.status(200).json({ success: true, total: rows.length, data: rows });
    } catch (error) { res.status(500).json({ success: false, message: "Server Error", error: error.message }); }
};

module.exports = { createUser, getUsers, getProvinces, getProvinceById, getPeople, getPersonById, createPerson, searchPeople };