export const requireAdmin = (req, res, next) => {
  // Admin role check middleware logic
  next();
};

export default requireAdmin;
