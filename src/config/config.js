import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Use import assertion for JSON
import config from './config.json' assert { type: 'json' }; // Adjust the path as necessary

// Load environment variables
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Update the password for production and development from the .env file
if (env === 'development') {
  dbConfig.password = process.env.DB_DEV_PASSWORD || dbConfig.password;
} else if (env === 'production') {
  dbConfig.password = process.env.DB_PROD_PASSWORD || dbConfig.password;
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  logging: false,
});

export default sequelize;
