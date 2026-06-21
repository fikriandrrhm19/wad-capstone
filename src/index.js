const config = require('./config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/cors');
const { apiLimiter, authLimiter, sensitiveLimiter } = require('./config/rateLimiter');

const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/tasks.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const milestonesRoutes = require('./routes/milestones.routes');
//const authenticate = require('./middleware/authenticate');
const setupSwagger = require('./docs/swagger');

const app = express();

app.use(helmet());

app.use(cors(corsOptions));
//app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/', apiLimiter);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
    });
    next();
});

//app.use('/health', routes); // /health
app.use('/', routes); // /api/info, /api/echo/:msg
app.use('/api', routes);

app.use('/auth/login', authLimiter);
app.use('/auth/refresh', sensitiveLimiter);
app.use('/auth', authRoutes);

//app.use('/api/v1', authenticate);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/milestones', milestonesRoutes);

setupSwagger(app);

app.use((req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} tidak ditemukan.`,
            hint: 'Kunjungi GET /api/docs untuk dokumentasi API.',
            details: [
                {
                    target: 'routing',
                    issue: `Endpoint dengan metode ${req.method} belum diimplementasikan di server.`
                }
            ]
        },
    });
});

app.use((err, req, res, next) => {
    if (err.message && err.message.includes('tidak diizinkan oleh CORS')) {
        return res.status(403).json({
            error: { 
                code: 'CORS_ERROR', 
                message: err.message,
                details: [{ target: 'cors', issue: 'Akses diblokir oleh kebijakan keamanan Cross-Origin Resource Sharing.' }]
            }
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: { 
                code: err.code || 'AUTH_ERROR', 
                message: err.message,
                details: err.details || [{ target: 'authentication', issue: 'Sesi token tidak valid atau telah kedaluwarsa.' }]
            }
        });
    }

    if (err.code === 'P2002') {
        const conflictField = err.meta?.target ? err.meta.target.join(', ') : 'field';
        return res.status(409).json({
            error: {
                code: 'DUPLICATE_RESOURCE',
                message: 'Data sudah digunakan.',
                details: [
                    { 
                        target: conflictField, 
                        issue: `Nilai pada kolom [${conflictField}] melanggar aturan unique constraint database.` 
                    }
                ]
            }
        });
    }

    console.error('Unhandled error:', err.message);
    res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: config.env === 'development' ? err.message : 'Terjadi kesalahan di server.',
            details: [
                { 
                    target: 'server', 
                    issue: config.env === 'development' ? err.stack.split('\n')[0] : 'Silakan hubungi administrator sistem.' 
                }
            ]
        }
    });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(config.port, () => {
    console.log('─'.repeat(55));
    console.log(` ${config.appName} v${config.version}`);
    console.log(` Environment : ${config.env}`);
    console.log(` Server      : http://localhost:${config.port}`);
    console.log(` Docs        : http://localhost:${config.port}/api/docs`);
    console.log(` Security    : Helmet ✓ CORS ✓ Rate Limit ✓`);
    console.log('─'.repeat(55));
});

module.exports = app;