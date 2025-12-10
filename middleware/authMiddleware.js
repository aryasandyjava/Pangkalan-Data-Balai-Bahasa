const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Silakan login terlebih dahulu' 
    });
  }
  next();
};

module.exports = authMiddleware;