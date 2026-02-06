const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma");

async function getAdminToken() {
  const email = `admin${Date.now()}@mail.com`;

  // cria usuário
  await request(app).post("/auth/register").send({
    name: "Admin",
    email,
    password: "123456",
  });

  // promove no banco (garante ADMIN mesmo se já existir gente)
  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  // login
  const login = await request(app).post("/auth/login").send({
    email,
    password: "123456",
  });

  return login.body.token;
}

describe("Logs", () => {
  it("ADMIN should access logs", async () => {
    const token = await getAdminToken();

    // gera um log
    await request(app)
      .get("/countries?page=1&limit=1")
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/logs?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
  });
});
