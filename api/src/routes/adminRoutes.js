const express = require('express');

const { notImplemented } = require('../utils/notImplemented');

const router = express.Router();

router.get('/dashboard', notImplemented('GET /admin/dashboard'));

router.get('/elections', notImplemented('GET /admin/elections'));
router.post('/elections', notImplemented('POST /admin/elections'));
router.get('/elections/:electionId', notImplemented('GET /admin/elections/:electionId'));
router.patch('/elections/:electionId', notImplemented('PATCH /admin/elections/:electionId'));
router.post('/elections/:electionId/publish', notImplemented('POST /admin/elections/:electionId/publish'));
router.post('/elections/:electionId/close', notImplemented('POST /admin/elections/:electionId/close'));

router.get('/lgas', notImplemented('GET /admin/lgas'));
router.post('/lgas', notImplemented('POST /admin/lgas'));
router.get('/wards', notImplemented('GET /admin/wards'));
router.post('/wards', notImplemented('POST /admin/wards'));
router.get('/polling-units', notImplemented('GET /admin/polling-units'));
router.post('/polling-units', notImplemented('POST /admin/polling-units'));

router.get('/parties', notImplemented('GET /admin/parties'));
router.post('/parties', notImplemented('POST /admin/parties'));
router.get('/candidates', notImplemented('GET /admin/candidates'));
router.post('/candidates', notImplemented('POST /admin/candidates'));
router.patch('/candidates/:candidateId', notImplemented('PATCH /admin/candidates/:candidateId'));

router.get('/voters', notImplemented('GET /admin/voters'));
router.post('/voters', notImplemented('POST /admin/voters'));
router.post('/voters/import', notImplemented('POST /admin/voters/import'));
router.get('/voters/:voterId', notImplemented('GET /admin/voters/:voterId'));
router.patch('/voters/:voterId', notImplemented('PATCH /admin/voters/:voterId'));
router.patch('/voters/:voterId/status', notImplemented('PATCH /admin/voters/:voterId/status'));

router.get('/results/summary', notImplemented('GET /admin/results/summary'));
router.get('/results/lgas', notImplemented('GET /admin/results/lgas'));
router.get('/audit-logs', notImplemented('GET /admin/audit-logs'));

module.exports = { adminRoutes: router };
