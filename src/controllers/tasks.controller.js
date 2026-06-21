const taskRepo = require('../repositories/task.repository');
// ─── GET /api/v1/tasks ──────────────────────────────────────
const listTasks = async (req, res, next) => {
    try {
        const { status, priority, sort, order, limit, offset } = req.query;

        const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;

        const { data, total } = await taskRepo.findMany({
            userId,
            status, 
            priority,
            sort, 
            order, 
            limit, 
            offset
        });
        const numLimit = Number(limit) || 10;
        const numOffset = Number(offset) || 0;
        res.status(200).json({
            data,
            pagination: {
                total,
                limit: numLimit,
                offset: numOffset,
                hasNext: numOffset + numLimit < total,
                hasPrev: numOffset > 0,
                nextOffset: numOffset + numLimit < total ? numOffset + numLimit : null,
                prevOffset: numOffset > 0 ? Math.max(0, numOffset - numLimit) : null,
            },
        });
    } catch (err) { next(err); }
};
// ─── POST /api/v1/tasks ─────────────────────────────────────
const createTask = async (req, res, next) => {
    try {
        // Sementara hardcode userId=1 (autentikasi di Minggu 6)
        const task = await taskRepo.create({
            ...req.body,
            userId: req.user.userId
        });
        res.status(201).set('Location', `/api/v1/tasks/${task.id}`).json({
            data: task
        });
    } catch (err) { next(err); }
};
// ─── GET /api/v1/tasks/:id ──────────────────────────────────
const getTask = async (req, res, next) => {
    try {
        //const task = await taskRepo.findById(req.params.id);
        const task = req.task;
        if (!task) {
            const fallbackTask = await taskRepo.findById(req.params.id);
            if (!fallbackTask) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: `Task ID ${req.params.id} tidak ditemukan.`,
                        details: [{ target: 'id', issue: 'Resource data task dengan ID tersebut tidak eksis di database.' }]
                    }
                });
            }
            return res.status(200).json({ data: fallbackTask });
        }
        res.status(200).json({ data: task });
    } catch (err) { next(err); }
};
// ─── PATCH /api/v1/tasks/:id ────────────────────────────────
const updateTask = async (req, res, next) => {
    try {
        const task = await taskRepo.update(req.params.id, req.body);
        if (!task) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Task ID ${req.params.id} tidak ditemukan.`,
                    details: [
                        { target: 'id', issue: 'Gagal memperbarui, data tidak ditemukan.' }]
                }
            });
        }
        res.status(200).json({ data: task });
    } catch (err) { next(err); }
};
// ─── DELETE /api/v1/tasks/:id ───────────────────────────────
const deleteTask = async (req, res, next) => {
    try {
        const ok = await taskRepo.remove(req.params.id);
        if (!ok) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Task ID ${req.params.id} tidak ditemukan.`,
                    details: [
                        { target: 'id', issue: 'Gagal menghapus, data tidak ditemukan.' }]
                }
            });
        }
        res.status(204).send();
    } catch (err) { next(err); }
};
// ─── GET /api/v1/users/:userId/tasks ────────────────────────
const getTasksByUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN' && Number(req.params.userId) !== req.user.userId) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Kamu tidak memiliki izin untuk melihat task milik pengguna lain.',
                    details: [{ target: 'userId', issue: 'Akses data multi-tenant diisolasi secara ketat.' }]
                }
            });
        }

        const result = await taskRepo.findByUser(req.params.userId);
        if (!result) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `User ID ${req.params.userId} tidak ditemukan.`,
                    details: [
                        { target: 'userId', issue: 'Data pengguna tidak terdaftar dalam sistem.' }]
                }
            });
        }
        res.status(200).json({
            data: {
                user: { id: result.id, name: result.name, email: result.email },
                tasks: result.tasks,
                total: result.tasks.length,
            }
        });
    } catch (err) { next(err); }
};

module.exports = {
    listTasks, 
    createTask, 
    getTask, 
    updateTask, 
    deleteTask, 
    getTasksByUser
};