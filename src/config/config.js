import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const env = process.env.NODE_ENV || 'development';

// Set database config based on environment
const dbConfig = {
  username:
    env === 'production'
      ? process.env.DB_PROD_USERNAME
      : process.env.DB_DEV_USERNAME,
  password:
    env === 'production'
      ? process.env.DB_PROD_PASSWORD
      : process.env.DB_DEV_PASSWORD,
  database:
    env === 'production'
      ? process.env.DB_PROD_DATABASE
      : process.env.DB_DEV_DATABASE,
  host:
    env === 'production' ? process.env.DB_PROD_HOST : process.env.DB_DEV_HOST,
  port:
    env === 'production' ? process.env.DB_PROD_PORT : process.env.DB_DEV_PORT,
  dialect: 'postgres', // or 'mysql' if that's what you're using
  logging: false,
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

export default sequelize;
