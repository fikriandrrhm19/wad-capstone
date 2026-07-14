const taskRepo = require('../repositories/task.repository');

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

const createTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const task = await taskRepo.create({
            ...req.body,
            userId: userId
        });
        
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("task:created", task);
            
            io.to(`user:${userId}`).emit("notification", {
                type: "SUCCESS",
                title: "Task Berhasil Dibuat",
                message: `Task "${task.title}" telah ditambahkan.`,
            });
            
            if (task.milestoneId) {
                const milestoneRepo = require('../repositories/milestone.repository');
                const milestone = await milestoneRepo.findById(task.milestoneId);
                if (milestone) {
                    io.to("tasks:global").emit("milestone:updated", milestone);
                }
            }
        }

        res.status(201).set('Location', `/api/v1/tasks/${task.id}`).json({
            data: task
        });
    } catch (err) { next(err); }
};

const getTask = async (req, res, next) => {
    try {
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

const updateTask = async (req, res, next) => {
    try {
        const task = await taskRepo.update(req.params.id, req.body);
        if (!task) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Task ID ${req.params.id} tidak ditemukan.`,
                    details: [{ target: 'id', issue: 'Gagal memperbarui, data tidak ditemukan.' }]
                }
            });
        }
        
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("task:updated", task);
            
            if (req.user.userId !== task.userId) {
                io.to(`user:${task.userId}`).emit("notification", {
                    type: "INFO",
                    title: "Task Diperbarui Admin",
                    message: `Task "${task.title}" milik Anda telah diperbarui oleh Administrator.`,
                });
            }
            
            if (task.milestoneId) {
                const milestoneRepo = require('../repositories/milestone.repository');
                const milestone = await milestoneRepo.findById(task.milestoneId);
                if (milestone) {
                    io.to("tasks:global").emit("milestone:updated", milestone);
                }
            }
        }

        res.status(200).json({ data: task });
    } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
    try {
        const idParam = req.params.id;
        const targetTask = await taskRepo.findById(idParam);
        const ok = await taskRepo.remove(idParam);
        if (!ok) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Task ID ${req.params.id} tidak ditemukan.`,
                    details: [{ target: 'id', issue: 'Gagal menghapus, data tidak ditemukan.' }]
                }
            });
        }
        
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("task:deleted", { taskId: parseInt(idParam) });
            
            if (targetTask && targetTask.milestoneId) {
                const milestoneRepo = require('../repositories/milestone.repository');
                const milestone = await milestoneRepo.findById(targetTask.milestoneId);
                if (milestone) {
                    io.to("tasks:global").emit("milestone:updated", milestone);
                }
            }
        }

        res.status(204).send();
    } catch (err) { next(err); }
};

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
                    details: [{ target: 'userId', issue: 'Data pengguna tidak terdaftar dalam sistem.' }]
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