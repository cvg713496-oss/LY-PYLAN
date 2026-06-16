const express = require('express');
const { createUser, getUsers, getProvinces, getProvinceById, getPeople, getPersonById, createPerson, searchPeople } = require('../controllers/userController'); 
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);

router.get('/provinces', getProvinces);
router.get('/provinces/:id', getProvinceById);

router.post('/people', createPerson);
router.get('/people/search', searchPeople); 
router.get('/people', getPeople);
router.get('/people/:id', getPersonById);

module.exports = router;