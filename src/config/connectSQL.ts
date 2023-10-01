// connectMySQL.ts
import sequelize from "./sequelize";

export async function connectMySQL() {
  try {
    await sequelize.authenticate(); // check if database connection is successful
    await sequelize.sync(); // create tables if they don't exist
    console.log("MySQL Database is connected successfully!")
    return true;
  } catch (error) {
    console.error("Error connecting MySQL", error);
    return false;
  }
}
