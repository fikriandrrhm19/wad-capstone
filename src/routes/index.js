const express = require('express');
const router = express.Router();
const { getHealth, getInfo, echo } = require('../controllers/healthController');
// ─── Kesehatan Server ───────────────────────────────────────
// GET /health — dipanggil di luar prefix /api
router.get('/health', getHealth);
// ─── API Routes ─────────────────────────────────────────────
router.get('/api/info', getInfo);
router.get('/api/echo/:msg', echo);
module.exports = router;