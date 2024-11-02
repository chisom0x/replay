import 'dotenv/config'; // Loads environment variables from .env
import { createServer } from './app.js';
import sequelize from './src/config/config.js';
// import './models/associations.ts';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected!');
    await sequelize.sync({ force: false, alter: true });
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const server = createServer();
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`API running on ${port}`);
});
