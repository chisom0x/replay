import UserService from '../../services/user_service.js';
import User from '../../models/user_model.js';

jest.mock('../../models/user_model.js'); // Mock the User model

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        photo: 'photo.jpg',
      };

      User.create.mockResolvedValue(mockUser); // Mock the create method

      const result = await UserService.createUser(
        'John',
        'Doe',
        'john.doe@example.com',
        'password123',
        'photo.jpg'
      );

      expect(User.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        photo: 'photo.jpg',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if create fails', async () => {
      User.create.mockRejectedValue(new Error('Create error'));

      await expect(
        UserService.createUser('John', 'Doe', 'john.doe@example.com', 'password123', 'photo.jpg')
      ).rejects.toThrow('Create error');
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if email exists', async () => {
      const mockUser = { id: 1, email: 'john.doe@example.com' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await UserService.findUserByEmail('john.doe@example.com');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserService.findUserByEmail('nonexistent@example.com');

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, firstName: 'John' };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await UserService.findUserById(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user ID does not exist', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await UserService.findUserById(999);

      expect(User.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('updateUserInfo', () => {
    it('should update user info', async () => {
      const mockUser = {
        id: 1,
        save: jest.fn().mockResolvedValue(),
      };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await UserService.updateUserInfo(1, 'photo.jpg', 'Jane', 'Doe', 'jane.doe@example.com');

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.firstName).toBe('Jane');
      expect(mockUser.lastName).toBe('Doe');
      expect(mockUser.photo).toBe('photo.jpg');
      expect(mockUser.email).toBe('jane.doe@example.com');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(
        UserService.updateUserInfo(999, 'photo.jpg', 'Jane', 'Doe', 'jane.doe@example.com')
      ).rejects.toThrow();
    });
  });

  describe('updateUserPassword', () => {
    it('should update the user password', async () => {
      const mockUser = {
        id: 1,
        save: jest.fn().mockResolvedValue(),
      };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await UserService.updateUserPassword(1, 'newpassword123');

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.password).toBe('newpassword123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(UserService.updateUserPassword(999, 'newpassword123')).rejects.toThrow();
    });
  });
});
