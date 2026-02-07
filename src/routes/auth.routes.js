const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginLimiter } = require("../middlewares/rateLimit");
const { z } = require("zod");
const { validate } = require("../middlewares/validate");

const registerSchema = z.object({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    }),
  });
  
  const loginSchema = z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  });

router.post("/register", validate(registerSchema), async (req, res, next) => {
   try {
    const { name, email, password } = req.body;
     if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Primeiro usuário como ADMIN (ajuda no teste)
    const usersCount = await prisma.user.count();
    const role = usersCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email, password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
