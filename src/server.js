import app from './app.js';
import { env } from './config/environment.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const PORT = env.port || 5000;
    app.listen(PORT, () => {
      console.log(`[Server] Cleaner App Backend running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
