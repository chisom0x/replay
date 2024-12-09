import User from '../models/user_model.js';

export default class UserService {
  static async createUser(firstName, lastName, email, password, photo) {
    try {
      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        photo: photo,
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserInfo(userId, photo, firstName, lastName, email) {
    try {
      const user = await User.findByPk(userId);

      user.firstName = firstName;
      user.lastName = lastName;
      user.photo = photo;
      user.email = email;

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPassword(userId, password) {
    try {
      const user = await User.findByPk(userId);

      user.password = password;

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
