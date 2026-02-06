const request = require("supertest");
const app = require("../app");

describe("Auth", () => {
  const email = `user${Date.now()}@mail.com`;

  it("register + login", async () => {
    const reg = await request(app).post("/auth/register").send({
      name: "Teste",
      email,
      password: "123456"
    });
    expect(reg.statusCode).toBe(201);

    const login = await request(app).post("/auth/login").send({
      email,
      password: "123456"
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});
