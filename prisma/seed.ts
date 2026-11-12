import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Free trial session: Mon-Fri, 30-minute slots between 10:00 and 18:00 German time,
  // 1 person per slot. startTime/endTime are the opening window; the slots are generated in app/lib/trial.ts.
  const trial = await prisma.course.upsert({
    where: { slug: 'free-trial' },
    update: {
      name: 'Free trial session',
      description: 'A short, free online session with Dr. Shoba Kapoor.',
      daysOfWeek: '1,2,3,4,5',
      startTime: '10:00',
      endTime: '18:00',
      capacity: 1,
      isActive: true,
    },
    create: {
      slug: 'free-trial',
      name: 'Free trial session',
      description: 'A short, free online session with Dr. Shoba Kapoor.',
      startDate: '2026-01-01',
      daysOfWeek: '1,2,3,4,5',
      startTime: '10:00',
      endTime: '18:00',
      capacity: 1,
      isActive: true,
    },
  });

  // The old A1/A2 batches are gone from the site. Keep the rows (old bookings point to them), but hide them.
  const hidden = await prisma.course.updateMany({
    where: { slug: { in: ['a1-new', 'a1-rep'] } },
    data: { isActive: false },
  });

  console.log('✅ Seeded:', { trial: trial.name, deactivatedOldCourses: hidden.count });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
