export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.render(req.route.path.includes("login") ? "auth/login" : "auth/register", {
        message: error.details[0].message
      });
    }
    next();
  };
};
