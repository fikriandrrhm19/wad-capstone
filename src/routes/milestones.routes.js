const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestone.controller');
const validate = require('../middleware/validate');
const { createMilestoneSchema, updateMilestoneSchema } = require('../validators/milestone.validator');

// ─── Urutan Pemetaan Endpoint RESTful Milestone ─────────────────────────

// GET /api/v1/milestones = Mengambil semua milestone milik pengguna yang login (JOIN tasks)
router.get('/', milestoneController.listMilestones);

// POST /api/v1/milestones = Membuat milestone baru dengan memvalidasi body request Joi
router.post('/', validate(createMilestoneSchema, 'body'), milestoneController.createMilestone);

// GET /api/v1/milestones/:id = Mengambil detail satu milestone tertentu
router.get('/:id', milestoneController.getMilestone);

// PATCH /api/v1/milestones/:id = Memperbarui sebagian data milestone dengan memvalidasi parsial Joi
router.patch('/:id', validate(updateMilestoneSchema, 'body'), milestoneController.updateMilestone);

// DELETE /api/v1/milestones/:id = Menghapus data milestone secara permanen
router.delete('/:id', milestoneController.deleteMilestone);

module.exports = router;