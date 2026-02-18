const jwt = require("jsonwebtoken");

const role = (requiredRole) => {
  return (req, res, next) => {const jwt = require("jsonwebtoken");

const role = (requiredRole) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next(); // 🔥 VERY IMPORTANT
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = role;

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next(); // 🔥 VERY IMPORTANT
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = role;
