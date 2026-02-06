require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const loggingMiddleware = require("./middlewares/logging");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const countriesRoutes = require("./routes/countries.routes");
const logsRoutes = require("./routes/logs.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Log de TODAS chamadas (antes das rotas)
app.use(loggingMiddleware);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/countries", countriesRoutes);
app.use("/logs", logsRoutes);

// Handler de erro simples
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || "Internal error" });
});

module.exports = app;
