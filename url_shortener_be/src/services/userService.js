import db from "../database/models/index.js";
const Users = db["User"];

class UserService {

  static async createUser(user) {
    const newUser = await Users.create(user);
    return newUser;
  }

  static async getUser(id) {
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    return user;
  }

  static async getUserByEmail(email) {
    try {
      const user = await Users.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getUserByRefreshToken(refreshToken) {
    try {
      const user = await Users.findOne({
        where: { refreshToken },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by refresh token:", error);
      throw error;
    }
  }

  static async updateRefreshToken(id, refreshToken) {
    try {
      await Users.update(
        { refreshToken },
        { where: { id } }
      );
      return true;
    } catch (error) {
      console.error("Error updating refresh token:", error);
      throw error;
    }
  }

  static async updateUser(id, user) {
    const userToUpdate = await Users.findOne(
      { where: { id } },
      { attributes: { exclude: ["password"] } }
    );
    if (userToUpdate) {
      await Users.update(user, { where: { id } });
      return user;
    }
    return null;
  }

  static async deleteUser(id) {
    const userToDelete = await Users.findOne({ where: { id } });
    if (userToDelete) {
      await Users.destroy({ where: { id } });
      return userToDelete;
    }
    return null;
  }
}

export default UserService;
