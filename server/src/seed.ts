import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    }
  });

  console.log('Database seeded');
};

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());