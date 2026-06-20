const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasks.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { checkTaskOwnership } = require('../middleware/checkOwnership');
const {
    createTaskSchema,
    replaceTaskSchema,
    updateTaskSchema,
    listTasksSchema,
} = require('../validators/task.validator');

router.use(authenticate);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ambil daftar task dengan pagination, filtering, dan sorting
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman (maks 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Jumlah data yang dilewati
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar task
 */
router.get('/', validate(listTasksSchema, 'query'), ctrl.listTasks);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Buat task baru
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */
// POST /api/v1/tasks — USER dan ADMIN bisa buat task
router.post('/', validate(createTaskSchema, 'body'), authorize('USER', 'ADMIN'), ctrl.createTask);

// GET /api/v1/tasks/:id — User bisa lihat task sendiri, admin lihat semua
router.get('/:id', checkTaskOwnership, ctrl.getTask);

// PATCH /api/v1/tasks/:id — Hanya pemilik atau admin yang bisa mengubah data
router.patch('/:id', checkTaskOwnership, validate(updateTaskSchema, 'body'), ctrl.updateTask);

// DELETE /api/v1/tasks/:id — Hanya pemilik atau admin yang bisa menghapus data
router.delete('/:id', checkTaskOwnership, ctrl.deleteTask);

module.exports = router;