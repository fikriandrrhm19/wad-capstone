const Joi = require('joi');

// Nilai yang valid untuk field status dan priority
const VALID_STATUS = ['todo', 'in_progress', 'done'];
const VALID_PRIORITY = ['low', 'medium', 'high'];
const VALID_SORT = ['createdAt', 'updatedAt', 'title', 'priority'];
const VALID_ORDER = ['asc', 'desc'];

const indonesianMessages = {
    'string.empty': 'Judul tugas tidak boleh kosong.',
    'any.required': 'Judul tugas wajib diisi.',
    'string.max': 'Panjang judul tugas tidak boleh melebihi {#limit} karakter.',
    'any.only': 'Nilai yang dimasukkan untuk {#label} tidak valid.'
};

// Schema untuk CREATE task (POST /tasks)
// Semua field wajib kecuali yang diberi .default()
const createTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        'string.empty': 'Judul tugas tidak boleh kosong.',
        'any.required': 'Judul tugas wajib diisi.'
    }),
    description: Joi.string().trim().max(1000).optional().allow(''),
    status: Joi.string().valid(...VALID_STATUS).default('todo').messages({ 'any.only': 'Status harus bernilai todo, in_progress, atau done.' }),
    priority: Joi.string().valid(...VALID_PRIORITY).default('medium').messages({ 'any.only': 'Prioritas harus bernilai low, medium, atau high.' }),
    dueDate: Joi.date().iso().min('now').optional().messages({ 'date.format': 'Format tanggal tenggat waktu harus ISO date.' }),
    userId: Joi.number().integer().positive().optional(),
    categoryId: Joi.number().integer().positive().optional()
});
// Schema untuk FULL UPDATE (PUT /tasks/:id) — semua field wajib
const replaceTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        'string.empty': 'Judul tugas tidak boleh kosong.',
        'any.required': 'Judul tugas wajib diisi.'
    }),
    description: Joi.string().trim().max(1000).optional().allow(''),
    status: Joi.string().valid(...VALID_STATUS).required().messages({ 'any.only': 'Status wajib diisi dengan nilai yang valid.' }),
    priority: Joi.string().valid(...VALID_PRIORITY).required().messages({ 'any.only': 'Prioritas wajib diisi dengan nilai yang valid.' }),
    dueDate: Joi.date().iso().optional().allow(null),
});
// Schema untuk PARTIAL UPDATE (PATCH /tasks/:id) — minimal 1 field
const updateTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).messages({ 'string.empty': 'Judul tugas tidak boleh kosong.' }),
    description: Joi.string().trim().max(1000).allow(''),
    status: Joi.string().valid(...VALID_STATUS).messages({ 'any.only': 'Status tidak valid.' }),
    priority: Joi.string().valid(...VALID_PRIORITY).messages({ 'any.only': 'Prioritas tidak valid.' }),
    dueDate: Joi.date().iso().allow(null),
}).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk update.' 
});
// Schema untuk QUERY PARAMS di GET /tasks
const listTasksSchema = Joi.object({
    status: Joi.string().valid(...VALID_STATUS).optional(),
    priority: Joi.string().valid(...VALID_PRIORITY).optional(),
    sort: Joi.string().valid(...VALID_SORT).default('createdAt'),
    order: Joi.string().valid(...VALID_ORDER).default('desc'),
    limit: Joi.number().integer().min(1).max(100).default(10),
    offset: Joi.number().integer().min(0).default(0),
});

module.exports = {
    createTaskSchema, replaceTaskSchema, updateTaskSchema, listTasksSchema
};