const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth");
const { fetchAllCountries, normalizeCountry, applyFilters } = require("../services/countries.service");

function toInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 10)));
    const skip = (page - 1) * limit;

    const raw = await fetchAllCountries();
    const normalized = raw.map(normalizeCountry);

    const filtered = applyFilters(normalized, req.query);

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    res.json({ page, limit, total, items });
  } catch (e) {
    next(e);
  }
});

router.get("/:code", requireAuth, async (req, res, next) => {
  try {
    const code = String(req.params.code || "").toUpperCase();

    // Busca por código via endpoint específico (mais eficiente)
    const axios = require("axios");
    const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name,cca2,cca3,region,subregion,population,capital,currencies,languages`;
    const { data } = await axios.get(url, { timeout: 10000 });

    const c = Array.isArray(data) ? data[0] : data;
    if (!c) return res.status(404).json({ message: "Not found" });

    const { normalizeCountry } = require("../services/countries.service");
    res.json(normalizeCountry(c));
  } catch (e) {
    if (String(e.message).includes("404")) return res.status(404).json({ message: "Not found" });
    next(e);
  }
});

module.exports = router;
