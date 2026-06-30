import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding IASA database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('Admin@123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iasa.local' },
    update: {},
    create: {
      email: 'admin@iasa.local',
      name: 'IASA Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create demo analyst
  const analystPassword = await bcrypt.hash('Analyst@123!', 12);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@iasa.local' },
    update: {},
    create: {
      email: 'analyst@iasa.local',
      name: 'Security Analyst',
      password: analystPassword,
      role: 'ANALYST',
    },
  });

  // Create demo project using PetStore API
  const project = await prisma.project.upsert({
    where: { id: 'demo-project-001' },
    update: {},
    create: {
      id: 'demo-project-001',
      name: 'PetStore Demo API',
      description: 'Swagger PetStore API — used for IASA demonstration',
      baseUrl: 'https://petstore3.swagger.io/api/v3',
      environment: 'DEVELOPMENT',
      tags: ['demo', 'petstore', 'openapi'],
      userId: analyst.id,
    },
  });

  console.log(`✅ Created users: ${admin.email}, ${analyst.email}`);
  console.log(`✅ Created demo project: ${project.name}`);
  console.log('');
  console.log('🔐 Demo credentials:');
  console.log('   Admin:    admin@iasa.local / Admin@123!');
  console.log('   Analyst:  analyst@iasa.local / Analyst@123!');
  console.log('');
  console.log('🚀 Ready! Open http://localhost:3000 to start');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
