const milestoneRepo = require('../repositories/milestone.repository');

// ─── GET /api/v1/milestones (Ambil Semua Milestone Pengguna) ───
const listMilestones = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestones = await milestoneRepo.findAll(userId);
        
        res.status(200).json({
            data: milestones
        });
    } catch (err) { 
        next(err); 
    }
};

// ─── POST /api/v1/milestones (Buat Milestone Baru) ───
const createMilestone = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestoneData = {
            ...req.body,
            userId
        };
        
        const milestone = await milestoneRepo.create(milestoneData);
        
        res.status(201).json({
            message: 'Milestone berhasil dibuat.',
            data: milestone
        });
    } catch (err) { 
        next(err); 
    }
};

// ─── GET /api/v1/milestones/:id (Ambil Detail Satu Milestone) ───
const getMilestone = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestoneId = req.params.id;
        
        const milestone = await milestoneRepo.findById(milestoneId, userId);
        
        if (!milestone) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [
                        { target: 'id', issue: 'Resource data milestone dengan ID tersebut tidak eksis atau Anda tidak memiliki hak akses.' }
                    ]
                }
            });
        }
        
        res.status(200).json({ 
            data: milestone 
        });
    } catch (err) { 
        next(err); 
    }
};

// ─── PATCH /api/v1/milestones/:id (Pembaruan Parsial Milestone) ───
const updateMilestone = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestoneId = req.params.id;
        
        const milestone = await milestoneRepo.update(milestoneId, userId, req.body);
        
        if (!milestone) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [
                        { target: 'id', issue: 'Gagal memperbarui data, resource tidak ditemukan atau Anda tidak memiliki otoritas.' }
                    ]
                }
            });
        }
        
        res.status(200).json({ 
            message: 'Milestone berhasil diperbarui.',
            data: milestone 
        });
    } catch (err) { 
        next(err); 
    }
};

// ─── DELETE /api/v1/milestones/:id (Hapus Milestone) ───
const deleteMilestone = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const milestoneId = req.params.id;
        
        const ok = await milestoneRepo.remove(milestoneId, userId);
        
        if (!ok) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: `Milestone ID ${milestoneId} tidak ditemukan.`,
                    details: [
                        { target: 'id', issue: 'Gagal menghapus data, resource tidak ditemukan atau Anda tidak memiliki otoritas.' }
                    ]
                }
            });
        }
        
        res.status(200).json({ 
            message: 'Milestone berhasil dihapus.' 
        });
    } catch (err) { 
        next(err); 
    }
};

module.exports = {
    listMilestones,
    createMilestone,
    getMilestone,
    updateMilestone,
    deleteMilestone
};