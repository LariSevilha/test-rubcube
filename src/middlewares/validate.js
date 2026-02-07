function validate(schema) {
    return (req, res, next) => {
      try {
        const parsed = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        req.validated = parsed; // opcional
        return next();
      } catch (e) {
        return res.status(400).json({
          message: "Validation error",
          issues: e.issues?.map((x) => ({ path: x.path.join("."), message: x.message })) || [],
        });
      }
    };
  }
  
  module.exports = { validate };
  