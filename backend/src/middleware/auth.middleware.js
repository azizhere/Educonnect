import ROLES from "../constants/roles.js";

export const auth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send("Not logged in");
  }
  next();
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).send("Not logged in");
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send("Access Denied");
    }

    next();
  };
};
