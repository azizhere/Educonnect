export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error:", err);

  res.status(500).render("error", {
    message: err.message || "Internal Server Error"
  });
};
