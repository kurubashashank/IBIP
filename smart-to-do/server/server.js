import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();
const port = process.env.PORT || 5500;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();
app.use(express.json());
app.use('/api/tasks', taskRoutes);
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});
app.listen(port, () => {
  console.log(`🚀 Smart To-Do Backend Running on http://localhost:${port}`);
});
