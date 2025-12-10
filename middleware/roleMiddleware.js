const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.role || !allowedRoles.includes(req.session.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Anda tidak memiliki akses ke halaman ini' 
      });
    }
    next();
  };
};

module.exports = roleMiddleware;