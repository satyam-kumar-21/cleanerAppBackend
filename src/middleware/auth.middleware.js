import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Bearer token required in Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];
  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error,
    });
  }

  req.user = decoded;
  next();
};

export default authenticate;
