const axios = require("axios");

async function fetchAllCountries() {
  // Campos pra reduzir payload
  const url = "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,population,capital,currencies,languages";
  const { data } = await axios.get(url, { timeout: 10000 });
  return data;
}

function normalizeCountry(c) {
  const name = c?.name?.common || null;
  const currencies = c?.currencies ? Object.keys(c.currencies) : [];
  const languages = c?.languages ? Object.keys(c.languages) : [];
  return {
    name,
    cca2: c.cca2 || null,
    cca3: c.cca3 || null,
    region: c.region || null,
    subregion: c.subregion || null,
    population: c.population || 0,
    capital: c.capital || [],
    currencies,
    languages,
  };
}

function applyFilters(items, q) {
  let out = items;

  if (q.name) {
    const n = String(q.name).toLowerCase();
    out = out.filter(x => (x.name || "").toLowerCase().includes(n));
  }
  if (q.region) {
    const r = String(q.region).toLowerCase();
    out = out.filter(x => (x.region || "").toLowerCase() === r);
  }
  if (q.currency) {
    const cur = String(q.currency).toUpperCase();
    out = out.filter(x => x.currencies.includes(cur));
  }
  if (q.language) {
    const lang = String(q.language).toLowerCase();
    out = out.filter(x => x.languages.map(l => l.toLowerCase()).includes(lang));
  }
  if (q.minPopulation) {
    const minP = parseInt(q.minPopulation, 10);
    if (Number.isFinite(minP)) out = out.filter(x => x.population >= minP);
  }
  if (q.maxPopulation) {
    const maxP = parseInt(q.maxPopulation, 10);
    if (Number.isFinite(maxP)) out = out.filter(x => x.population <= maxP);
  }

  return out;
}

module.exports = { fetchAllCountries, normalizeCountry, applyFilters };
