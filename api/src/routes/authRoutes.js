const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminUser = require('../models/AdminUser');
const { env } = require('../config/env');

const { notImplemented } = require('../utils/notImplemented');

const router = express.Router();

function parseName(fullName = '') {
	const trimmed = fullName.trim();
	if (!trimmed) {
		return { firstName: '', lastName: '' };
	}

	const parts = trimmed.split(/\s+/);
	const firstName = parts.shift() || '';
	const lastName = parts.join(' ') || firstName;

	return { firstName, lastName };
}

function signAccessToken(adminUser) {
	return jwt.sign(
		{
			sub: adminUser._id.toString(),
			role: adminUser.role,
			email: adminUser.email,
		},
		env.jwtSecret,
		{ expiresIn: env.accessTokenTtl }
	);
}

router.post('/admin/signup', async (req, res) => {
	const { email, password, fullName, phoneNumber } = req.body || {};

	if (!email || !password || !fullName) {
		return res.status(400).json({
			message: 'email, password, and fullName are required.',
		});
	}

	if (password.length < 8) {
		return res.status(400).json({
			message: 'Password must be at least 8 characters.',
		});
	}

	const normalizedEmail = String(email).trim().toLowerCase();
	const existingUser = await AdminUser.findOne({ email: normalizedEmail }).lean();
	if (existingUser) {
		return res.status(409).json({ message: 'Admin account already exists.' });
	}

	const { firstName, lastName } = parseName(fullName);
	if (!firstName || !lastName) {
		return res.status(400).json({ message: 'Please provide a valid full name.' });
	}

	const passwordHash = await bcrypt.hash(String(password), 12);

	const adminUser = await AdminUser.create({
		firstName,
		lastName,
		email: normalizedEmail,
		phone: phoneNumber,
		passwordHash,
		role: 'SUPER_ADMIN',
		lastLoginAt: new Date(),
	});

	const accessToken = signAccessToken(adminUser);

	return res.status(201).json({
		accessToken,
		user: {
			id: adminUser._id,
			email: adminUser.email,
			fullName: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
			role: adminUser.role,
		},
	});
});

router.post('/admin/signin', async (req, res) => {
	const { email, password } = req.body || {};

	if (!email || !password) {
		return res.status(400).json({ message: 'email and password are required.' });
	}

	const normalizedEmail = String(email).trim().toLowerCase();
	const adminUser = await AdminUser.findOne({ email: normalizedEmail });

	if (!adminUser || !adminUser.isActive) {
		return res.status(401).json({ message: 'Invalid email or password.' });
	}

	const isPasswordValid = await bcrypt.compare(String(password), adminUser.passwordHash);
	if (!isPasswordValid) {
		return res.status(401).json({ message: 'Invalid email or password.' });
	}

	adminUser.lastLoginAt = new Date();
	await adminUser.save();

	const accessToken = signAccessToken(adminUser);

	return res.json({
		accessToken,
		user: {
			id: adminUser._id,
			email: adminUser.email,
			fullName: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
			role: adminUser.role,
		},
	});
});

router.post('/request-otp', notImplemented('POST /auth/request-otp'));
router.post('/verify-otp', notImplemented('POST /auth/verify-otp'));
router.post('/refresh', notImplemented('POST /auth/refresh'));
router.post('/logout', notImplemented('POST /auth/logout'));

module.exports = { authRoutes: router };
