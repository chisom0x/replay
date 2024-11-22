import Authentication from '../../controller/auth_controller.js';
import UserService from '../../services/user_service.js';
import bcrypt from 'bcryptjs';
import createSendToken from '../../utils/jwt_helper.js';
import AppError from '../../utils/app_error.js';

jest.mock('../../services/user_service.js');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt_helper.js');

describe('Authentication Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return an error if firstName is missing', async () => {
      mockReq.body = {
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
      };
      await Authentication.signUp(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('Please enter your first name!', 400)
      );
    });

    it('should return an error if lastName is missing', async () => {
      mockReq.body = {
        firstName: 'John',
        email: 'test@example.com',
        password: 'password123',
      };
      await Authentication.signUp(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please enter your lastname!', 400)
      );
    });

    it('should return an error if email is missing', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };
      await Authentication.signUp(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please enter your email address!', 400)
      );
    });

    it('should return an error if password is missing', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      };
      await Authentication.signUp(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please set a password!', 400)
      );
    });

    it('should return an error if email is already in use', async () => {
      UserService.findUserByEmail.mockResolvedValue(true);
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
      };
      await Authentication.signUp(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('email already in use!', 400)
      );
    });

    it('should create a user and send a token on success', async () => {
      UserService.findUserByEmail.mockResolvedValue(null);
      UserService.createUser.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });
      createSendToken.mockImplementation(() => {});
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
      };

      await Authentication.signUp(mockReq, mockRes, mockNext);

      expect(UserService.createUser).toHaveBeenCalledWith(
        'John',
        'Doe',
        'test@example.com',
        'password123'
      );
      expect(createSendToken).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com' },
        200,
        mockRes
      );
    });
  });

  describe('login', () => {
    it('should return an error if email is missing', async () => {
      mockReq.body = { password: 'password123' };
      await Authentication.login(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please enter your email address', 400)
      );
    });

    it('should return an error if password is missing', async () => {
      mockReq.body = { email: 'test@example.com' };
      await Authentication.login(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please enter a password', 400)
      );
    });

    it('should return an error if user is not found', async () => {
      UserService.findUserByEmail.mockResolvedValue(null);
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      bcrypt.compare.mockResolvedValue(false);

      await Authentication.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('incorrect email or password!', 400)
      );
    });

    it('should return an error if password does not match', async () => {
      UserService.findUserByEmail.mockResolvedValue({
        password: 'hashedpassword',
      });
      mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
      bcrypt.compare.mockResolvedValue(false);

      await Authentication.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('incorrect email or password!', 400)
      );
    });

    it('should send a token on successful login', async () => {
      UserService.findUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      bcrypt.compare.mockResolvedValue(true);
      createSendToken.mockImplementation(() => {});
      mockReq.body = { email: 'test@example.com', password: 'password123' };

      await Authentication.login(mockReq, mockRes, mockNext);

      expect(createSendToken).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com', password: 'hashedpassword' },
        200,
        mockRes
      );
    });
  });
});
