import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
config();


const sequelize = new Sequelize({
  database: 'mysql',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql',
  sync: {alter: true},
});

export default sequelize;
