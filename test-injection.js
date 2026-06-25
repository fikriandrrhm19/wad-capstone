require('dotenv').config();
const prisma = require('./src/config/prisma');

async function demo() {
    console.log('--- Memulai Demo Mitigasi SQL Injection ---');
    
    const maliciousEmail = "' OR '1'='1";
    
    console.log(`Input payload penyerang: ${maliciousEmail}`);
    console.log('Mengeksekusi query aman via Prisma findUnique()...');

    const user = await prisma.user.findUnique({
        where: { email: maliciousEmail }
    });

    // Hasil yang diharapkan adalah null, karena tidak ada user dengan alamat email literal tersebut.
    console.log('Hasil Pencarian User:', user); 
    
    if (user === null) {
        console.log('>> STATUS: AMAN. Prisma berhasil memitigasi serangan SQL Injection!');
    } else {
        console.log('>> STATUS: BAHAYA. Terjadi kebocoran data!');
    }
}

demo()
    .catch((e) => {
        console.error('Terjadi kesalahan saat menjalankan demo:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });