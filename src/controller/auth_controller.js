import UserService from '../services/user_service.js';
import bcrypt from 'bcryptjs';
import AppError from '../utils/app_error.js';
import createSendToken from '../utils/jwt_helper.js';
import AuthValidations from '../validations/auth_validations.js';

export default class Authentication {
  static async signUp(req, res, next) {
    try {
      const { error } = AuthValidations.signUpValidation(req.body);
      if (error) {
        const message = error.details.map((err) => err.message).join(', ');
        return next(new AppError(message, 400));
      }

      const { firstName, lastName, email, password } = req.body;

      const userExists = await UserService.findUserByEmail(email);

      if (userExists) return next(new AppError('Email already in use!', 400));

      const user = await UserService.createUser(
        firstName,
        lastName,
        email,
        password
      );
      return createSendToken(user, 200, res);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { error } = AuthValidations.loginValidation(req.body);
      if (error) {
        const message = error.details.map((err) => err.message).join(', ');
        return next(new AppError(message, 400));
      }

      const { email, password } = req.body;

      const user = await UserService.findUserByEmail(email);

      let userPass = !user ? 'no_user' : user.password;
      const pass = await bcrypt.compare(password, userPass);

      if (user && pass) return createSendToken(user, 200, res);
      return next(new AppError('Incorrect email or password!', 400));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
