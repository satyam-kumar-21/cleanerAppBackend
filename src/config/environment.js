export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/cleanerApp',
  jwtSecret: process.env.JWT_SECRET || 'cleaner-super-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeReturnUrl: process.env.STRIPE_RETURN_URL || 'myapp://upgrade',
  backendPublicUrl: process.env.BACKEND_PUBLIC_URL,
};

export default env;
