export const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.session.toast = "Please login first";
    return res.redirect("/auth/login");
  }
  next();
};
