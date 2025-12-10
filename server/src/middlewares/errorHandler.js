module.exports = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.json({ error: err.message });
};
