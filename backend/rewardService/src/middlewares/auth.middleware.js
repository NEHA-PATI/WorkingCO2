module.exports = (req, res, next) => {
  const u_id = req.headers['x-user-id'];

  if (!u_id) {
    return res.status(401).json({ message: 'Unauthorized: u_id missing' });
  }

  req.u_id = u_id;
  next();
};
