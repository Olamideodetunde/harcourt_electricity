import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Tariffs
  const tariffs = [
    { band: 'A', rate_per_kwh: 225 },
    { band: 'B', rate_per_kwh: 63 },
    { band: 'C', rate_per_kwh: 50 },
  ];

  for (const t of tariffs) {
    await prisma.tariff.upsert({
      where: { band: t.band },
      update: {},
      create: t,
    });
  }
  console.log('Tariffs seeded');

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@phedc.example' },
    update: {},
    create: {
      email: 'admin@phedc.example',
      password_hash: adminPassword,
      full_name: 'System Admin',
      role: 'superadmin',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 3. Create Customer User
  const customerPassword = await bcrypt.hash('password123', 10);
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password_hash: customerPassword,
      full_name: 'Test Customer',
      phone: '08012345678',
    },
  });
  console.log('Customer user seeded:', customer.email);

  // 4. Create Meter for Customer
  const meter = await prisma.meter.upsert({
    where: { meter_number: '04040404040' },
    update: {},
    create: {
      meter_number: '04040404040',
      customer_id: customer.id,
      tariff_band: 'A',
      units_balance: 0,
    },
  });
  console.log('Meter seeded for customer:', meter.meter_number);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
