const prisma = require('../config/prisma');

const milestoneRepository = {
    async findAll(userId) {
        const where = {};
        if (userId !== undefined) {
            where.userId = Number(userId);
        }

        return await prisma.milestone.findMany({
            where,
            orderBy: { 
                dueDate: 'asc'
            },
            include: {
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true
                    }
                }
            }
        });
    },

    async findById(id, userId) {
        const where = { id: Number(id) };
        if (userId !== undefined) {
            where.userId = Number(userId);
        }

        return await prisma.milestone.findFirst({
            where,
            include: {
                tasks: true
            }
        });
    },

    async create(data) {
        return await prisma.milestone.create({
            data: {
                title: data.title,
                description: data.description || null,
                dueDate: new Date(data.dueDate),
                status: data.status ? data.status.toUpperCase() : 'PENDING',
                userId: Number(data.userId)
            },
            include: {
                tasks: true
            }
        });
    },

    async update(id, userId, data) {
        try {
            const updatePayload = {};

            if (data.title !== undefined) updatePayload.title = data.title;
            if (data.description !== undefined) updatePayload.description = data.description;
            if (data.dueDate !== undefined) updatePayload.dueDate = data.dueDate ? new Date(data.dueDate) : null;
            if (data.status !== undefined) updatePayload.status = data.status.toUpperCase();

            const result = await prisma.milestone.updateMany({
                where: {
                    id: Number(id),
                    userId: Number(userId)
                },
                data: updatePayload
            });

            if (result.count === 0) return null;

            return await this.findById(id, userId);
        } catch (e) {
            throw e;
        }
    },

    async remove(id, userId) {
        try {
            const result = await prisma.milestone.deleteMany({
                where: {
                    id: Number(id),
                    userId: Number(userId)
                }
            });

            return result.count > 0;
        } catch (e) {
            throw e;
        }
    }
};

module.exports = milestoneRepository;