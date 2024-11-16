const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Missing Authorization header");
    return res.status(401).send("Missing Authorization header");
  }

  const token = authHeader.split(" ")[1];  // Extract token from the header
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use JWT_SECRET here
    console.log("Decoded Token:", decoded); // Log decoded token

    req.user = decoded; // Make the decoded user available to the route handlers
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).send("Invalid or expired token");
  }
};
