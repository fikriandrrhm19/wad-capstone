require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log('Mulai seeding...');
    // Hapus data lama (urutan penting karena foreign key!)
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    // ─── Buat Categories ─────────────────────────────────
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Belajar', color: '#6366F1' } }),
        prisma.category.create({ data: { name: 'Pekerjaan', color: '#F59E0B' } }),
        prisma.category.create({ data: { name: 'Proyek', color: '#10B981' } }),
    ]);
    console.log(` ✓ ${categories.length} kategori dibuat`);
    // ─── Buat Users ──────────────────────────────────────
    // Catatan: password di sini plain text hanya untuk seed.
    // Di aplikasi nyata, password harus di-hash (akan dibahas Minggu 6).
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Budi Santoso', email:
                    'budi@example.com', password: 'hashed_pw_1'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Siti Rahayu', email:
                    'siti@example.com', password: 'hashed_pw_2'
            }
        }),
    ]);
    console.log(` ✓ ${users.length} user dibuat`);
    // ─── Buat Tasks ──────────────────────────────────────
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Setup Express server', status: 'DONE', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[2].id,
            }
        }),
        prisma.task.create({
            data: {
                title: 'Belajar REST API', status: 'DONE', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[0].id,
            }
        }),
        prisma.task.create({
            data: {
                title: 'Setup PostgreSQL', description: 'Menggunakan Docker',
                status: 'IN_PROGRESS', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[2].id,
            }
        }),
        prisma.task.create({
            data: {
                title: 'Belajar Prisma ORM', status: 'TODO', priority: 'MEDIUM',
                userId: users[0].id, categoryId: categories[0].id,
            }
        }),
        prisma.task.create({
            data: {
                title: 'Review laporan bulanan', status: 'TODO', priority: 'LOW',
                userId: users[1].id, categoryId: categories[1].id,
            }
        }),
        prisma.task.create({
            data: {
                title: 'Meeting dengan tim desain', status: 'TODO', priority:
                    'MEDIUM',
                userId: users[1].id, categoryId: categories[1].id,
            }
        }),
    ]);
    console.log(` ✓ ${tasks.length} task dibuat`);
    console.log('Seeding selesai!');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });