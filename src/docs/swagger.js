const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: config.appName,
            version: config.version,
            description: 'REST API untuk capstone project Web Advanced Development.',
        },
        servers: [{
            url: `http://localhost:${config.port}/api/v1`, 
            description: 'Local Dev'
        }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Masukkan Access Token JWT Anda format: Bearer <token>',
                }
            },
            schemas: {
                CreateTask: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            type: 'string', minLength: 1, maxLength: 200,
                            example: 'Belajar Joi Validation'
                        },
                        description: {
                            type: 'string', maxLength: 1000, example:
                                'Mempelajari cara validasi input dengan Joi'
                        },
                        status: {
                            type: 'string', enum: ['todo', 'in_progress', 'done'],
                            default: 'todo'
                        },
                        priority: {
                            type: 'string', enum: ['low', 'medium', 'high'],
                            default: 'medium'
                        },
                        dueDate: {
                            type: 'string', format: 'date-time', example: '2024-12-31T00:00:00Z'
                        },
                    },
                },
                Task: {
                    allOf: [
                        { '$ref': '#/components/schemas/CreateTask' },
                        {
                            type: 'object', properties: {
                                id: { type: 'integer', example: 1 },
                                createdAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' },
                            }
                        },
                    ],
                },
                CreateMilestone: {
                    type: 'object',
                    required: ['title', 'dueDate'],
                    properties: {
                        title: {
                            type: 'string',
                            maxLength: 255,
                            example: 'Kick-off Pengembangan Aplikasi Web'
                        },
                        description: {
                            type: 'string',
                            maxLength: 1000,
                            example: 'Inisialisasi server dasar dan konfigurasi routing selesai.'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date',
                            example: '2026-07-01'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'achieved'],
                            default: 'pending'
                        }
                    }
                },
                Milestone: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Kick-off Pengembangan Aplikasi Web' },
                        description: { type: 'string', example: 'Inisialisasi server dasar selesai.' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-07-01T00:00:00.000Z' },
                        status: { type: 'string', example: 'ACHIEVED' },
                        userId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        tasks: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', example: 1 },
                                    title: { type: 'string', example: 'Setup Express server' },
                                    status: { type: 'string', example: 'DONE' },
                                    priority: { type: 'string', example: 'HIGH' }
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'VALIDATION_ERROR' },
                                message: {
                                    type: 'string', example: 'Data yang dikirim tidak valid.'
                                }, details: {
                                    type: 'array', items: {
                                        type: 'object',
                                        properties: {
                                            target: { type: 'string', example: 'title' },
                                            issue: { type: 'string', example: 'Judul milestone wajib diisi.' },
                                        },
                                    }
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            { name: 'Tasks', description: 'Operasi CRUD untuk resource Task' },
            { name: 'Milestones', description: 'Operasi CRUD untuk resource Milestone Perencanaan Proyek' }
        ],
    },
    // swagger-jsdoc akan membaca JSDoc comment dari file-file ini
    apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
/**
* Daftarkan Swagger UI ke Express app.
* Dipanggil dari src/index.js
*/
const setupSwagger = (app) => {
    // Sajikan Swagger UI di /api/docs
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: `${config.appName} - API Docs`,
    }));
    // Sajikan raw JSON spec di /api/docs.json (berguna untuk code generation)
    app.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(` Docs: http://localhost:${config.port}/api/docs`);
};

module.exports = setupSwagger;