function validateNumericBody(...fields) {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return res.status(400).json({ error: `Field ${field} must be a valid number` });
      }
    }
    next();
  };
}

module.exports = { validateNumericBody };
