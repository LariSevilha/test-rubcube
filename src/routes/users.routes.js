const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const { requireAuth } = require("../middlewares/auth");

// helpers
function toInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const { name, email, role } = req.query;

    // USER só pode listar a si mesmo; ADMIN pode listar todos
    const where = {};
    if (req.user.role !== "ADMIN") {
      where.id = req.user.sub;
    } else {
      if (name) where.name = { contains: String(name), mode: "insensitive" };
      if (email) where.email = { contains: String(email), mode: "insensitive" };
      if (role) where.role = String(role);
    }

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      }),
    ]);

    res.json({ page, limit, total, items });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN" && req.user.sub !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) return res.status(404).json({ message: "Not found" });

    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    // Só ADMIN cria usuário por aqui (register cria normal)
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: role || "USER" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN" && req.user.sub !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, email, password, role } = req.body || {};

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.passwordHash = await bcrypt.hash(password, 10);

    // só ADMIN altera role
    if (role && req.user.role === "ADMIN") data.role = role;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    res.json(updated);
  } catch (e) {
    // Prisma: se email duplicado, cai aqui
    if (String(e.message).includes("Unique constraint")) {
      return res.status(409).json({ message: "Email already in use" });
    }
    next(e);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN" && req.user.sub !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
