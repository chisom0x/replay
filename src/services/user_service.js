import User from "../models/user_model.js";

export default class UserService {
  static async createUser(
    firstName,
    lastName,
    email,
    password,
    photo
  ) {
    try {
      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        photo: photo
      });

      return newUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user!');
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
        throw new Error('Error finding user by email!');
    }
  }
}
