// seed.js - safe: reads FLAG from env (do NOT commit env with flag)
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  // Reset (dev only)
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: { username: 'alice', password: 'alicepass', fullname: 'Alice Example', isAdmin: false }
  });

  const flag = process.env.FLAG;
  if (!flag) {
    console.error("WARNING: FLAG environment variable not set. Seed will insert admin without secret.");
  }

  await prisma.user.create({
    data: { username: 'admin', password: 'adminpassword', fullname: 'Administrator', isAdmin: true, secret: flag || null }
  });

  console.log("Seeding done.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
