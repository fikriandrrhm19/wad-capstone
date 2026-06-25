const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const userRepo = require('../repositories/user.repository');
const taskRepo = require('../repositories/task.repository');
const prisma = require('../config/prisma');

router.use(authenticate, authorize('ADMIN'));

router.get('/users', async (req, res, next) => {
    try {
        const users = await userRepo.findAll();
        res.json({ data: users, total: users.length });
    } catch (err) { 
        next(err); 
    }
});

router.patch('/users/:id/role', async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                error: { 
                    code: 'INVALID_ROLE', 
                    message: 'Role harus USER atau ADMIN.' 
                }
            });
        }
        
        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json({ data: user });
    } catch (err) { 
        next(err); 
    }
});

router.get('/tasks', async (req, res, next) => {
    try {
        const result = await taskRepo.findAll({});
        res.json({ data: result.data, total: result.total });
    } catch (err) { 
        next(err); 
    }
});

module.exports = router;