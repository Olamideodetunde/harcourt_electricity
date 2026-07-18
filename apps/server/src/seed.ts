import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@phedc.example' },
    update: {},
    create: {
      email: 'admin@phedc.example',
      full_name: 'Super Admin',
      password_hash: adminPassword,
      role: 'superadmin',
    },
  });

  const tariffs = [
    { band: 'A', rate_per_kwh: 50.00 },
    { band: 'B', rate_per_kwh: 45.00 },
    { band: 'C', rate_per_kwh: 40.00 },
    { band: 'D', rate_per_kwh: 30.00 },
  ];

  for (const t of tariffs) {
    await prisma.tariff.upsert({
      where: { band: t.band },
      update: { rate_per_kwh: t.rate_per_kwh },
      create: { band: t.band, rate_per_kwh: t.rate_per_kwh },
    });
  }

  const customerPassword = await bcrypt.hash('password123', 10);
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      full_name: 'John Doe',
      phone: '08012345678',
      password_hash: customerPassword,
    },
  });

  await prisma.meter.upsert({
    where: { meter_number: '04040404040' },
    update: {},
    create: {
      meter_number: '04040404040',
      tariff_band: 'A',
      customer_id: customer.id,
      units_balance: 0,
    },
  });

  console.log('Database seeded.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
