const prisma = require('../config/prisma');

const parseSafeDate = (value) => {
    if (value === undefined) return undefined;
    if (value === null || String(value).trim() === "" || String(value).includes("Invalid Date")) {
        return null;
    }
    const timestamp = Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
};

const taskRepository = {
    async findMany({ userId, status, priority, sort = 'createdAt', order = 'desc', limit = 10, offset = 0 } = {}) {
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

    async findById(id) {
        return prisma.task.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true, color: true } },
            },
        });
    },

    async create(data) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status ? data.status.toUpperCase() : 'TODO',
                priority: data.priority ? data.priority.toUpperCase() : 'MEDIUM',
                dueDate: parseSafeDate(data.dueDate),
                userId: Number(data.userId),
                categoryId: data.categoryId ? Number(data.categoryId) : null,
                milestoneId: data.milestoneId ? Number(data.milestoneId) : null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true, color: true } },
            },
        });
    },

    async update(id, data) {
        try {
            const updatePayload = {};

            if (data.title !== undefined) updatePayload.title = data.title;
            if (data.description !== undefined) updatePayload.description = data.description;
            if (data.status !== undefined) updatePayload.status = data.status.toUpperCase();
            if (data.priority !== undefined) updatePayload.priority = data.priority.toUpperCase();
            
            if (data.dueDate !== undefined) {
                updatePayload.dueDate = parseSafeDate(data.dueDate);
            }
            
            if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId ? Number(data.categoryId) : null;
            if (data.milestoneId !== undefined) updatePayload.milestoneId = data.milestoneId ? Number(data.milestoneId) : null;
            
            return await prisma.task.update({
                where: { id: Number(id) },
                data: updatePayload,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    category: { select: { id: true, name: true, color: true } },
                },
            });
        } catch (e) {
            if (e.code === 'P2025') return null;
            throw e;
        }
    },

    async remove(id) {
        try {
            await prisma.task.delete({ where: { id: Number(id) } });
            return true;
        } catch (e) {
            if (e.code === 'P2025') return false;
            throw e;
        }
    },

    async findByUser(userId) {
        return prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                tasks: {
                    include: {
                        category: {
                            select: { id: true, name: true, color: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    },
};

module.exports = taskRepository;