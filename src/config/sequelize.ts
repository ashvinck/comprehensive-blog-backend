import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { createDatabase } from './init.mysql';
config();

createDatabase();

const sequelize = new Sequelize({
  database: 'comprehensive_blog',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql',
  sync: {alter: true},
});

export default sequelize;
