/**
 * Middleware to check if the authenticated user has an 'admin' role.
 * Should be used AFTER the 'auth' middleware which populates req.user.
 */
module.exports = (req, res, next) => {
  // DEBUG LOG
  console.log('--- isAdmin Middleware Check ---');
  console.log('User from token:', req.user);
  
  if (req.user && req.user.role === 'admin') {
    console.log('Access granted: User is admin');
    next();
  } else {
    console.log('Access denied: User is NOT admin. Role found:', req.user ? req.user.role : 'NULL');
    return res.status(403).json({ 
      success: false, 
      message: 'Truy cập bị từ chối. Quyền quản trị viên là bắt buộc.' 
    });
  }
};
