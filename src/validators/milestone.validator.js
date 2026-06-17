const Joi = require('joi');

const VALID_MILESTONE_STATUS = ['pending', 'achieved'];

// Schema untuk CREATE Milestone (POST /api/v1/milestones)
const createMilestoneSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255).required().messages({
        'string.base': 'Judul milestone harus berupa teks.',
        'string.empty': 'Judul milestone tidak boleh kosong.',
        'string.max': 'Panjang judul milestone tidak boleh melebihi 255 karakter.',
        'any.required': 'Judul milestone wajib diisi.'
    }),
    description: Joi.string().trim().max(1000).optional().allow('', null).messages({
        'string.base': 'Deskripsi milestone harus berupa teks.',
        'string.max': 'Panjang deskripsi milestone tidak boleh melebihi 1000 karakter.'
    }),
    dueDate: Joi.date().iso().required().messages({
        'date.base': 'Format tanggal tenggat waktu milestone tidak valid.',
        'date.format': 'Format tanggal tenggat waktu milestone harus ISO 8601 date format (YYYY-MM-DD).',
        'any.required': 'Tanggal tenggat waktu milestone wajib diisi.'
    }),
    status: Joi.string().valid(...VALID_MILESTONE_STATUS).default('pending').messages({
        'any.only': 'Status milestone harus bernilai pending atau achieved.'
    })
});

// Schema untuk PARTIAL UPDATE Milestone (PATCH /api/v1/milestones/:id)
const updateMilestoneSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255).messages({
        'string.base': 'Judul milestone harus berupa teks.',
        'string.empty': 'Judul milestone tidak boleh kosong.',
        'string.max': 'Panjang judul milestone tidak boleh melebihi 255 karakter.'
    }),
    description: Joi.string().trim().max(1000).allow('', null).messages({
        'string.base': 'Deskripsi milestone harus berupa teks.',
        'string.max': 'Panjang deskripsi milestone tidak boleh melebihi 1000 karakter.'
    }),
    dueDate: Joi.date().iso().messages({
        'date.base': 'Format tanggal tenggat waktu milestone tidak valid.',
        'date.format': 'Format tanggal tenggat waktu milestone harus ISO 8601 date format (YYYY-MM-DD).'
    }),
    status: Joi.string().valid(...VALID_MILESTONE_STATUS).messages({
        'any.only': 'Status milestone harus bernilai pending atau achieved.'
    })
}).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk memperbarui data milestone.'
});

module.exports = {
    createMilestoneSchema,
    updateMilestoneSchema
};