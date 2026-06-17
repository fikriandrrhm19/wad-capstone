const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestone.controller');
const validate = require('../middleware/validate');
const { createMilestoneSchema, updateMilestoneSchema } = require('../validators/milestone.validator');

// GET /api/v1/milestones = Mengambil semua milestone milik pengguna yang login (JOIN tasks)
/**
 * @swagger
 * /milestones:
 *   get:
 *     summary: Ambil semua koleksi milestone milik pengguna yang aktif (JOIN dengan Tasks)
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil array data milestone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Milestone'
 *       401:
 *         description: Otorisasi token gagal atau token tidak disertakan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', milestoneController.listMilestones);

// POST /api/v1/milestones = Membuat milestone baru dengan memvalidasi body request Joi
/**
 * @swagger
 * /milestones:
 *   post:
 *     summary: Buat milestone target perencanaan baru
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMilestone'
 *     responses:
 *       201:
 *         description: Milestone berhasil disimpan ke database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Milestone berhasil dibuat.
 *                 data:
 *                   $ref: '#/components/schemas/Milestone'
 *       400:
 *         description: Payload tidak lulus validasi penapisan Joi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token kedaluwarsa atau salah signature
 */
router.post('/', validate(createMilestoneSchema, 'body'), milestoneController.createMilestone);

// GET /api/v1/milestones/:id = Mengambil detail satu milestone tertentu
/**
 * @swagger
 * /milestones/{id}:
 *   get:
 *     summary: Ambil satu detail data milestone spesifik berdasarkan ID
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numerik milik milestone yang dicari
 *     responses:
 *       200:
 *         description: Detail objek data milestone ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Milestone'
 *       401:
 *         description: Sesi token tidak valid
 *       404:
 *         description: ID tidak eksis atau bukan hak milik pengguna tersebut
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', milestoneController.getMilestone);

// PATCH /api/v1/milestones/:id = Memperbarui sebagian data milestone dengan memvalidasi parsial Joi
/**
 * @swagger
 * /milestones/{id}:
 *   patch:
 *     summary: Perbarui data parsial field milestone tertentu
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID milestone yang akan dimodifikasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Judul milestone baru yang diubah
 *               status:
 *                 type: string
 *                 enum: [pending, achieved]
 *     responses:
 *       200:
 *         description: Data milestone sukses di-update parsial
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Milestone berhasil diperbarui.
 *                 data:
 *                   $ref: '#/components/schemas/Milestone'
 *       400:
 *         description: Pengiriman objek body kosong atau data tidak valid
 *       401:
 *         description: Sesi tidak sah
 *       404:
 *         description: Data tidak ditemukan
 */
router.patch('/:id', validate(updateMilestoneSchema, 'body'), milestoneController.updateMilestone);

// DELETE /api/v1/milestones/:id = Menghapus data milestone secara permanen
/**
 * @swagger
 * /milestones/{id}:
 *   delete:
 *     summary: Hapus milestone secara permanen dari basis data
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID target milestone yang ingin dieliminasi
 *     responses:
 *       200:
 *         description: Proses eliminasi sukses dilakukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Milestone berhasil dihapus.
 *       401:
 *         description: Sesi token kedaluwarsa
 *       404:
 *         description: Target resource data tidak eksis
 */
router.delete('/:id', milestoneController.deleteMilestone);

module.exports = router;