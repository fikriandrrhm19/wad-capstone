const milestoneRepo = require('../repositories/milestone.repository');

const listMilestones = async (req, res, next) => {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
        const milestones = await milestoneRepo.findAll(userId);
        res.status(200).json({ data: milestones });
    } catch (err) { next(err); }
};

const createMilestone = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestoneData = { ...req.body, userId };
        const milestone = await milestoneRepo.create(milestoneData);
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("milestone:created", { milestone });
            io.to(`user:${userId}`).emit("notification", {
                type: "SUCCESS",
                title: "Milestone Berhasil Dibuat",
                message: `Milestone "${milestone.title}" telah ditambahkan ke proyek.`
            });
        }
        res.status(201).json({ message: 'Milestone berhasil dibuat.', data: milestone });
    } catch (err) { next(err); }
};

const getMilestone = async (req, res, next) => {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
        const milestoneId = req.params.id;
        const milestone = await milestoneRepo.findById(milestoneId, userId);
        if (!milestone) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [{ target: 'id', issue: 'Resource data milestone dengan ID tersebut tidak eksis atau Anda tidak memiliki hak akses.' }]
                }
            });
        }
        res.status(200).json({ data: milestone });
    } catch (err) { next(err); }
};

const updateMilestone = async (req, res, next) => {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
        const milestoneId = req.params.id;
        
        if (req.body.status) {
            req.body.status = req.body.status.toLowerCase();
        }
        
        const milestone = await milestoneRepo.update(milestoneId, userId, req.body);
        if (!milestone) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [{ target: 'id', issue: 'Gagal memperbarui data, resource tidak ditemukan atau Anda tidak memiliki otoritas.' }]
                }
            });
        }
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("milestone:updated", { milestone });
            
            if (req.user.userId !== milestone.userId) {
                io.to(`user:${milestone.userId}`).emit("notification", {
                    type: "INFO",
                    title: "Milestone Diperbarui Admin",
                    message: `Milestone "${milestone.title}" milik Anda telah diperbarui oleh Administrator.`
                });
            }
        }
        res.status(200).json({ message: 'Milestone berhasil diperbarui.', data: milestone });
    } catch (err) { next(err); }
};

const deleteMilestone = async (req, res, next) => {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
        const milestoneId = req.params.id;
        const ok = await milestoneRepo.remove(milestoneId, userId);
        if (!ok) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [{ target: 'id', issue: 'Gagal menghapus data, resource tidak ditemukan atau Anda tidak memiliki otoritas.' }]
                }
            });
        }
        const io = req.app.get("io");
        if (io) {
            io.to("tasks:global").emit("milestone:deleted", { milestoneId: parseInt(milestoneId) });
        }
        res.status(200).json({ message: 'Milestone berhasil dihapus.' });
    } catch (err) { next(err); }
};

module.exports = { listMilestones, createMilestone, getMilestone, updateMilestone, deleteMilestone };