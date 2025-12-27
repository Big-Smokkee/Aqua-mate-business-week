const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
  try {
    // cookie token
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded; // user id/email available
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports = auth;
