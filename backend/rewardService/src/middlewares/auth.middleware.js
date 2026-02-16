const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized: Bearer token required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.u_id = decoded.u_id || decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid or expired token'
    });
  }
};
