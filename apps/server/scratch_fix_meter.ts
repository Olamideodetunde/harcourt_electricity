import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMeters() {
  const meters = await prisma.meter.findMany({
    include: { transactions: { include: { token: true } } }
  });

  for (const meter of meters) {
    let totalUnits = 0;
    for (const tx of meter.transactions) {
      if (tx.payment_status === 'successful' && tx.token) {
        totalUnits += Number(tx.token.units);
      }
    }

    if (totalUnits > 0) {
      await prisma.meter.update({
        where: { id: meter.id },
        data: { units_balance: totalUnits }
      });
      console.log(`Updated meter ${meter.meter_number} to ${totalUnits} units`);
    } else {
      console.log(`Meter ${meter.meter_number} has no units to update`);
    }
  }
}

fixMeters()
  .then(() => process.exit(0))
  .catch(console.error);
