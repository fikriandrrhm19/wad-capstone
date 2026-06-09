const prisma = require('../config/prisma');
const taskRepository = {
    // ─── Ambil semua task dengan filter, sort, dan pagination ──
    async findMany({ userId, status, priority, sort = 'createdAt', order =
        'desc', limit = 10, offset = 0 } = {}) {
        const where = {};
        if (userId) where.userId = Number(userId);
        if (status) where.status = status.toUpperCase();
        if (priority) where.priority = priority.toUpperCase();
        const [data, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { [sort]: order },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    category: { select: { id: true, name: true, color: true } },
                },
            }),
            prisma.task.count({ where }),
        ]);
        return { data, total };
    },
    // ─── Cari task by ID ────────────────────────────────────
    async findById(id) {
        return prisma.task.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true, color: true } },
            },
        });
    },
    // ─── Buat task baru ─────────────────────────────────────
    async create(data) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status ? data.status.toUpperCase() : 'TODO',
                priority: data.priority ? data.priority.toUpperCase() :
                    'MEDIUM',
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                userId: Number(data.userId),
                categoryId: data.categoryId ? Number(data.categoryId) : null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true, color: true } },
            },
        });
    },
    // ─── Update sebagian (PATCH) ─────────────────────────────
    async update(id, data) {
        try {
            return await prisma.task.update({
                where: { id: Number(id) },
                data: {
                    ...data,
                    status: data.status ? data.status.toUpperCase() :
                        undefined,
                    priority: data.priority ? data.priority.toUpperCase() :
                        undefined,
                    dueDate: data.dueDate ? new Date(data.dueDate) :
                        undefined,
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    category: { select: { id: true, name: true, color: true } },
                },
            });
        } catch (e) {
            // P2025: Record not found
            if (e.code === 'P2025') return null;
            throw e;
        }
    },
    // ─── Hapus task ──────────────────────────────────────────
    async remove(id) {
        try {
            await prisma.task.delete({ where: { id: Number(id) } });
            return true;
        } catch (e) {
            if (e.code === 'P2025') return false;
            throw e;
        }
    },
    // ─── Ambil semua task milik user tertentu (JOIN) ─────────
    async findByUser(userId) {
        return prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                tasks: {
                    include: {
                        category: {
                            select: {
                                id: true, name: true, color:
                                    true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    },
};
module.exports = taskRepository;