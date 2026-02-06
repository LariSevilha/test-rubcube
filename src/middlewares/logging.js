const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

module.exports = function loggingMiddleware(req, res, next) {
  const start = Date.now();

  // tenta extrair userId do token (se houver)
  let userId = null;
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload.sub;
    } catch {
      // token inválido: não interrompe request, só loga sem userId
    }
  }

  res.on("finish", async () => {
    try {
      const durationMs = Date.now() - start;
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
      // não quebra app se log falhar
      console.error("Log error:", e.message);
    }
  });

  next();
};
