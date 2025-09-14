import jwt from "jsonwebtoken";

// Authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token"
      });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware for specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions"
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  return authorizeRoles('admin')(req, res, next);
};

// NGO only middleware
export const ngoOnly = (req, res, next) => {
  return authorizeRoles('ngo')(req, res, next);
};

// User only middleware
export const userOnly = (req, res, next) => {
  return authorizeRoles('user')(req, res, next);
};

// Admin or NGO middleware
export const adminOrNgo = (req, res, next) => {
  return authorizeRoles('admin', 'ngo')(req, res, next);
};

export default {
  authenticateToken,
  authorizeRoles,
  adminOnly,
  ngoOnly,
  userOnly,
  adminOrNgo
};