'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import config.json with JSON import assertion
const config = await import(`${path.resolve()}/config/config.json`, {
  assert: { type: 'json' }
}).then(module => module.default)[env];

const db = {};

let sequelize;

// Determine the password based on the environment
const password =
  env === 'production' ? process.env.DB_PROD_PASSWORD : process.env.DB_DEV_PASSWORD;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
  });
}

fs
  .readdirSync(__dirname)
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
