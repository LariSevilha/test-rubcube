const router = require("express").Router();
const prisma = require("../prisma");
const { requireAuth, requireRole } = require("../middlewares/auth");

function toInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

router.get("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const { userId, endpoint, method, from, to } = req.query;

    const where = {};

    if (userId) where.userId = String(userId);
    if (endpoint) where.path = { contains: String(endpoint) };
    if (method) where.method = String(method).toUpperCase();

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [total, items] = await Promise.all([
      prisma.apiLog.count({ where }),
      prisma.apiLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({ page, limit, total, items });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
