const express = require('express');

const { AdminUser } = require('../models');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  hashPassword,
  signAdminAccessToken,
  toAdminAuthPayload,
  verifyPassword,
} = require('../utils/adminAuth');
const { notImplemented } = require('../utils/notImplemented');

const router = express.Router();

router.post(
  '/admin/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const adminUser = await AdminUser.findOne({
      email: String(email).toLowerCase().trim(),
    });

    if (!adminUser) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    if (!adminUser.isActive) {
      return res.status(403).json({
        message: 'This admin account has been deactivated.',
      });
    }

    const passwordIsValid = await verifyPassword(password, adminUser.passwordHash);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    adminUser.lastLoginAt = new Date();
    await adminUser.save();

    return res.status(200).json({
      message: 'Admin login successful.',
      accessToken: signAdminAccessToken(adminUser),
      admin: toAdminAuthPayload(adminUser),
    });
  })
);

router.patch(
  '/admin/reset-password-with-temp',
  asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email  || !newPassword) {
      return res.status(400).json({
        message: 'email, newPassword are required.',
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({
        message: 'newPassword must be at least 8 characters long.',
      });
    }

    const adminUser = await AdminUser.findOne({
      email: String(email).toLowerCase().trim(),
    });

    if (!adminUser) {
      return res.status(404).json({
        message: 'Admin user not found.',
      });
    }

    if (!adminUser.isActive) {
      return res.status(403).json({
        message: 'This admin account has been deactivated.',
      });
    }



    adminUser.passwordHash = await hashPassword(String(newPassword));
    adminUser.passwordChangeRequired = false;
    await adminUser.save();

    return res.status(200).json({
      message: 'Password reset successful. You can now log in with your new password.',
      admin: toAdminAuthPayload(adminUser),
    });
  })
);

router.post('/request-otp', notImplemented('POST /auth/request-otp'));
router.post('/verify-otp', notImplemented('POST /auth/verify-otp'));
router.post('/refresh', notImplemented('POST /auth/refresh'));
router.post('/logout', notImplemented('POST /auth/logout'));

module.exports = { authRoutes: router };
