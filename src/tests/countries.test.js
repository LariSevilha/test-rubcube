const request = require("supertest");
const app = require("../app");

async function getToken() {
  const email = `c${Date.now()}@mail.com`;
  await request(app).post("/auth/register").send({ name: "C", email, password: "123456" });
  const login = await request(app).post("/auth/login").send({ email, password: "123456" });
  return login.body.token;
}

describe("Countries", () => {
  it("should require auth", async () => {
    const r = await request(app).get("/countries");
    expect(r.statusCode).toBe(401);
  });

  it("should list with filters + pagination", async () => {
    const token = await getToken();
    const r = await request(app)
      .get("/countries?region=Americas&page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);
    expect(r.statusCode).toBe(200);
    expect(r.body.items.length).toBeLessThanOrEqual(5);
    expect(r.body.page).toBe(1);
  });
});
