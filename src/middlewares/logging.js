const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

// Ajuda a ter timestamps bonitos
function nowISO() {
  return new Date().toISOString();
}

// Evita log gigante (ex: query muito grande)
function shortPath(path, max = 120) {
  if (!path) return "";
  return path.length > max ? path.slice(0, max - 3) + "..." : path;
}

module.exports = function loggingMiddleware(req, res, next) {
  const start = Date.now();

  // Tenta pegar userId do JWT (se existir)
  let userId = null;
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload.sub;
    } catch {
      // token inválido: segue request normalmente, só não seta userId
    }
  }

  res.on("finish", async () => {
    const durationMs = Date.now() - start;
    const path = shortPath(req.originalUrl);

    // ✅ Log BONITO no terminal
    const who = userId ? `user=${userId}` : "user=anonymous";
    console.log(`${nowISO()} ➡️  ${req.method} ${path} ${res.statusCode} (${durationMs}ms) ${who}`);

    // ✅ Log no banco (não derruba app se falhar)
    try {
      await prisma.apiLog.create({
        data: {
          userId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          ip: req.ip,
          userAgent: req.headers["user-agent"] || null,
          durationMs,
        },
      });
    } catch (e) {
      console.error(`${nowISO()} ⚠️  Log DB error:`, e.message);
    }
  });

  next();
};
