require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
};

async function main() {
    console.log('Mulai seeding...');
    // Hapus data lama dengan urutan aman
    await prisma.task.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    // ─── Buat Categories ─────────────────────────────────
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Belajar', color: '#6366F1' } }),
        prisma.category.create({ data: { name: 'Pekerjaan', color: '#F59E0B' } }),
        prisma.category.create({ data: { name: 'Proyek', color: '#10B981' } }),
    ]);
    console.log(` ✓ ${categories.length} kategori dibuat`);
    // ─── Buat Users ──────────────────────────────────────
    const passwordBudi = await argon2.hash('password_budi_123', ARGON2_OPTIONS);
    const passwordSiti = await argon2.hash('password_siti_123', ARGON2_OPTIONS);
    
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Budi Santoso', 
                email: 'budi@example.com', 
                password: passwordBudi
            }
        }),
        prisma.user.create({
            data: {
                name: 'Siti Rahayu', 
                email: 'siti@example.com', 
                password: passwordSiti
            }
        }),
    ]);
    console.log(` ✓ ${users.length} user dibuat`);
    // ─── Buat Milestones ──────────────────────────────────────
    const milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          title: 'Kick-off Pengembangan Aplikasi Web',
          description: 'Inisialisasi server dasar dan routing utility selesai dikonfigurasi.',
          dueDate: new Date('2026-07-01'),
          status: 'ACHIEVED',
          userId: users[0].id
        }
      }),
      prisma.milestone.create({
        data: {
          title: 'Integrasi Database Relasional',
          description: 'Seluruh skema Prisma terbentuk dan sukses dimigrasikan ke PostgreSQL.',
          dueDate: new Date('2026-07-15'),
          status: 'PENDING',
          userId: users[0].id
        }
      }),
      prisma.milestone.create({
        data: {
          title: 'Sistem Autentikasi dan Keamanan Sesi',
          description: 'Implementasi JWT tokens beserta refresh token rotation berjalan kokoh.',
          dueDate: new Date('2026-08-01'),
          status: 'PENDING',
          userId: users[0].id
        }
      }),
      prisma.milestone.create({
        data: {
          title: 'Audit Evaluasi Internal Bulanan',
          description: 'Pemeriksaan performa laporan dan KPI tim kerja.',
          dueDate: new Date('2026-07-10'),
          status: 'PENDING',
          userId: users[1].id
        }
      }),
      prisma.milestone.create({
        data: {
          title: 'Peluncuran Fitur Dokumentasi Swagger UI',
          description: 'Seluruh endpoint terekspos interaktif di OpenAPI specification.',
          dueDate: new Date('2026-08-10'),
          status: 'PENDING',
          userId: users[1].id
        }
      })
    ]);
    console.log(` ✓ ${milestones.length} milestone pencapaian proyek dibuat`);
    // ─── Buat Tasks ──────────────────────────────────────
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Setup Express server', status: 'DONE', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[2].id,
                milestoneId: milestones[0].id
            }
        }),
        prisma.task.create({
            data: {
                title: 'Belajar REST API', status: 'DONE', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[0].id,
                milestoneId: milestones[0].id
            }
        }),
        prisma.task.create({
            data: {
                title: 'Setup PostgreSQL', description: 'Menggunakan Docker',
                status: 'IN_PROGRESS', priority: 'HIGH',
                userId: users[0].id, categoryId: categories[2].id,
                milestoneId: milestones[1].id
            }
        }),
        prisma.task.create({
            data: {
                title: 'Belajar Prisma ORM', status: 'TODO', priority: 'MEDIUM',
                userId: users[0].id, categoryId: categories[0].id,
                milestoneId: milestones[1].id
            }
        }),
        prisma.task.create({
            data: {
                title: 'Review laporan bulanan', status: 'TODO', priority: 'LOW',
                userId: users[1].id, categoryId: categories[1].id,
                milestoneId: milestones[3].id
            }
        }),
        prisma.task.create({
            data: {
                title: 'Meeting dengan tim desain', status: 'TODO', priority: 'MEDIUM',
                userId: users[1].id, categoryId: categories[1].id,
                milestoneId: milestones[3].id
            }
        }),
    ]);
    console.log(` ✓ ${tasks.length} task dibuat`);
    console.log('Seeding selesai!');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });