const request = require("supertest");
const app = require("../app");

async function getAdminToken() {
  const email = `admin${Date.now()}@mail.com`;
  await request(app).post("/auth/register").send({ name: "Admin", email, password: "123456" });
  const login = await request(app).post("/auth/login").send({ email, password: "123456" });
  return login.body.token;
}

describe("Users", () => {
  it("ADMIN should list users", async () => {
    const token = await getAdminToken();
    const res = await request(app)
      .get("/users?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
  });
});
