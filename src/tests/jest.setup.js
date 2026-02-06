const prisma = require("../prisma");

afterAll(async () => {
  await prisma.$disconnect();
});
