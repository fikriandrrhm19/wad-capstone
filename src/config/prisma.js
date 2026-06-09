const { PrismaClient } = require('@prisma/client');
// Singleton: hanya satu instance di seluruh aplikasi
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error'] // Log semua query di development
        : ['warn', 'error'], // Hanya log warning/error di production
});
// Tangani shutdown dengan bersih
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
module.exports = prisma;