import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;

  async validatePassword(password: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8,15]
      }
    },
  },
  {
    modelName: 'User',
    tableName: 'users',
    sequelize,
    
    hooks: {
      // Before creating a new user, hashing the password
      beforeCreate: async (user: User) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
      },
    },
  }
);

export default User;

