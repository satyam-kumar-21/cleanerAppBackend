import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/error.middleware.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import deviceRoutes from './routes/device.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import entitlementRoutes from './routes/entitlement.routes.js';
import licenseRoutes from './routes/license.routes.js';
import scanRoutes from './routes/scan.routes.js';
import cleanupRoutes from './routes/cleanup.routes.js';
import usageRoutes from './routes/usage.routes.js';
import configRoutes from './routes/config.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import supportRoutes from './routes/support.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { handleStripeWebhook } from './controllers/subscription.controller.js';

const app = express();

// Global Middlewares
app.use(cors(corsOptions));
app.post(
  '/api/v1/subscriptions/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cleaner App Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Cleaner App Backend API');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/entitlements', entitlementRoutes);
app.use('/api/v1/licenses', licenseRoutes);
app.use('/api/v1/scans', scanRoutes);
app.use('/api/v1/cleanups', cleanupRoutes);
app.use('/api/v1/usage', usageRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
