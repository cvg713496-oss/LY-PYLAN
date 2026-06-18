const db = require('../config/db');

// --- មុខងារសម្រាប់ Users ---
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


// --- មុខងារសម្រាប់ Province ---
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


// --- មុខងារសម្រាប់ People ---
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

// មុខងារនេះត្រូវបានកែសម្រួលដើម្បីការពារ Error 500
const createPerson = async (req, res) => {
    try {
        const { surname, givenname, dob, gender, province_id } = req.body;
        
        // ពិនិត្យមើលថាតើទិន្នន័យមានគ្រប់គ្រាន់ដែរឬទេ
        if (!surname || !givenname || !dob || !gender || !province_id) {
            return res.status(400).json({ success: false, message: "គ្រប់ Field ទាំងអស់គឺតម្រូវឱ្យបំពេញ!" });
        }

        const query = "INSERT INTO people (surname, givenname, dob, gender, province_id) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [surname, givenname, dob, gender, province_id]);
        res.status(201).json({ success: true, message: "Person created successfully!", insertId: result.insertId });
    } catch (error) { 
        console.error("Database Insert Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message }); 
    }
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

// ត្រូវប្រាកដថាមុខងារទាំងអស់នេះត្រូវបាន Export ចេញ
module.exports = { 
    createUser, 
    getUsers, 
    getProvinces, 
    getProvinceById, 
    getPeople, 
    getPersonById, 
    createPerson, 
    searchPeople 
};