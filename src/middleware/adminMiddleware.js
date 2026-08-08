const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
};

const staff = (req, res, next) => {
  if (req.user && ["admin", "staff"].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Staff access only" });
};

module.exports = { admin, staff };
