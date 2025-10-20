import { PrismaClient } from '@prisma/client';
import { PasswordService } from '../auth/config';

const prisma = new PrismaClient();

async function createSuperUser() {
  try {
    const username = 'admin';
    const password = 'admin123'; // Change this to a secure password
    const hashedPassword = await PasswordService.hashPassword(password);

    // Check if superuser already exists
    const existingUser = await prisma.person.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log(`❌ Superuser '${username}' already exists!`);
      return;
    }

    // Create superuser
    const superUser = await prisma.person.create({
      data: {
        username,
        passwordHash: hashedPassword,
        role: 'system', // SYSTEM role
        name: 'System',
        familyName: 'Administrator',
        email: 'admin@gmp.local',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('✅ Superuser created successfully!');
    console.log('📋 Details:');
    console.log(`   Username: ${superUser.username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${superUser.role}`);
    console.log(`   ID: ${superUser.id}`);
    console.log('');
    console.log('🔐 You can now login with these credentials and access all S3 endpoints');

  } catch (error) {
    console.error('❌ Error creating superuser:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperUser();