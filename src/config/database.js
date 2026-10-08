import mongoose from 'mongoose';

const connectDatabase = async () => {
  const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/cleanerApp';

  // Mongoose connection options
  const options = {
    serverSelectionTimeoutMS: 5000,  // fail fast if mongo not reachable
    socketTimeoutMS: 45000,
    family: 4,                        // use IPv4 (avoids issues on some systems)
  };

  try {
    const conn = await mongoose.connect(dbUrl, options);
    console.log(`[Database] Connected to: ${conn.connection.host} → ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[Database] Connection error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error.message);
    console.error('[Database] Make sure MongoDB is running on:', dbUrl);
    throw error; // Let server.js handle the crash
  }
};

export { connectDatabase };
export default connectDatabase;
