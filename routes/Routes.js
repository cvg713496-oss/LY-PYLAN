const express = require('express');

// ⚠️ ត្រូវប្រាកដថាបានបន្ថែមពាក្យ createPerson នៅទីនេះ
const express = require('express');
const { createUser, getUsers, getProvinces, getPeople, getPersonById, getProvinceById, createPerson, searchPeople } = require('../controllers/userController'); 
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);

router.get('/provinces', getProvinces);
router.get('/provinces/:id', getProvinceById);

router.post('/people', createPerson);
router.get('/people', getPeople);

// 🌟 Route សម្រាប់ Search ត្រូវតែនៅពីលើ route /people/:id
router.get('/people/search', searchPeople); 

router.get('/people/:id', getPersonById);

module.exports = router;
