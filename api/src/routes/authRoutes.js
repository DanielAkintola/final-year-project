const express = require('express');

const { notImplemented } = require('../utils/notImplemented');

const router = express.Router();

router.post('/request-otp', notImplemented('POST /auth/request-otp'));
router.post('/verify-otp', notImplemented('POST /auth/verify-otp'));
router.post('/refresh', notImplemented('POST /auth/refresh'));
router.post('/logout', notImplemented('POST /auth/logout'));

module.exports = { authRoutes: router };
