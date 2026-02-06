const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development";
  console.log("");
  console.log("🚀 Backend Test API");
  console.log(`📦 Environment: ${env}`);
  console.log(`🗄️  Database: SQLite (dev.db)`);
  console.log(`🌍 Server running at http://localhost:${PORT}`);
  console.log("");
});
