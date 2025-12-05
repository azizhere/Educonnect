import ROLES from "../constants/roles.js";
import jwt from "jsonwebtoken";

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

export function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

export function ensureRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).send("Forbidden");
    }
    next();
  };
}

export const preventBackHistory = (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
};

export const verifyJWT = (req, res, next) => {
  const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).send("Invalid token.");
  }
};