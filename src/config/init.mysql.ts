import mysql from 'mysql2';
import { config } from 'dotenv';
config();


export const createDatabase = () => {
// Open connection to MYSQL Server;
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS comprehensive_blog`, (err, res) => {
    console.log(res);
    console.error(err);
  }
)

//  Close the connection
connection.end();
}
