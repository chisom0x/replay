'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import config.json with JSON import assertion
const config = await import(`${path.resolve()}/config/config.json`, {
  assert: { type: 'json' }
}).then(module => module.default)[env];

// Set database configuration based on the environment
if (env === 'development') {
  config.username = process.env.DB_DEV_USERNAME || config.username;
  config.password = process.env.DB_DEV_PASSWORD || config.password;
  config.database = process.env.DB_DEV_DATABASE || config.database;
  config.host = process.env.DB_DEV_HOST || config.host;
} else if (env === 'production') {
  config.username = process.env.DB_PROD_USERNAME || config.username;
  config.password = process.env.DB_PROD_PASSWORD || config.password;
  config.database = process.env.DB_PROD_DATABASE || config.database;
  config.host = process.env.DB_PROD_HOST || config.host;
}

const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
  });
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
