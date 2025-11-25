export const toastMiddleware = (req, res, next) => {
  res.locals.toast = req.session.toast || null;
  req.session.toast = null; // clear after showing
  next();
};
