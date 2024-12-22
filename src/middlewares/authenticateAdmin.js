const authenticateAdmin = (req, res, next) => {
    const userRole = req.user.role; // Assuming role is saved in the JWT payload
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
  };
  
  router.get('/', authenticateToken, authenticateAdmin, UserController.getAllUsers);
  