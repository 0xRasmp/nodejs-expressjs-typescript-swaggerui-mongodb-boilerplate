import express, { Application } from 'express';
import mongoose from 'mongoose';
import serverRoutes from './routes/serverRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use server routes
app.use('/api', serverRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 