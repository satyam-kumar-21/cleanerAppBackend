export const requireActiveSubscription = (req, res, next) => {
  // Active subscription check middleware logic
  next();
};

export default requireActiveSubscription;
