const prisma = require("../src/prisma");

async function reset() {
  await prisma.apiLog.deleteMany();
  await prisma.user.deleteMany();

  console.log("Banco limpo com sucesso");
  await prisma.$disconnect();
}

reset();
