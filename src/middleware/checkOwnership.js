const taskRepo = require('../repositories/task.repository');
const milestoneRepo = require('../repositories/milestone.repository');

/**
 * Middleware untuk memastikan user hanya bisa mengakses task miliknya sendiri.
 * Admin diizinkan mengakses task siapapun.
 * Digunakan SETELAH middleware authenticate.
 */
const checkTaskOwnership = async (req, res, next) => {
    try {
        if (req.user.role === 'ADMIN') return next();

        const task = await taskRepo.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                error: { code: 'NOT_FOUND', message: 'Task tidak ditemukan.' },
            });
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Kamu tidak memiliki izin untuk mengakses task ini.',
                },
            });
        }

        req.task = task;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware Tambahan UTS: Memastikan user hanya bisa mengakses milestone miliknya sendiri.
 * Admin diizinkan mengakses milestone siapapun.
 */
const checkMilestoneOwnership = async (req, res, next) => {
    try {
        if (req.user.role === 'ADMIN') return next();

        const milestone = await milestoneRepo.findById(req.params.id);
        if (!milestone) {
            return res.status(404).json({
                error: { code: 'NOT_FOUND', message: 'Milestone tidak ditemukan.' },
            });
        }

        if (milestone.userId !== req.user.userId) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Kamu tidak memiliki izin untuk mengakses milestone ini.',
                },
            });
        }

        req.milestone = milestone;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { 
    checkTaskOwnership,
    checkMilestoneOwnership
};