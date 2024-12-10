# Replay - Photo Pooling App (Backend)

Replay is a backend service for a photo pooling app where users can create galleries and share links for friends to upload their photos. This makes it easy to collect memories from events in one shared location.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)

---

## Features
- **Photo Pooling**: Users can share unique links for uploading photos to their galleries.
- **Secure Backend**: Authentication, rate limiting, and input sanitization ensure secure operations.
- **Cloud Integration**: Utilizes Cloudinary for image hosting.
- **Efficient API Design**: Built using Express and Sequelize for scalable and maintainable backend services.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chisom0x/replay.git
   cd replay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```
   CLOUDINARY_URL=<your-cloudinary-url>
   JWT_SECRET=<your-secret-key>
   DATABASE_URL=<your-database-url>
   ```
   Ensure all required environment variables are configured for the app.

---

## Usage

Start the application:
- Development mode (auto-restarts):
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

Run tests:
  ```bash
  npm test
  ```

---

## Commands

- **Run Tests**: 
  ```bash
  npm test
  ```
  Executes all test suites using Jest in watch mode.

- **Development Mode**: 
  ```bash
  npm run dev
  ```
  Starts the application with `nodemon`, enabling hot reload during development.

- **Start Application**: 
  ```bash
  npm start
  ```
  Launches the application in production mode.

---

## Dependencies

### Core Dependencies:
- `bcryptjs`: Password hashing.
- `body-parser`: Parse incoming request bodies.
- `cloudinary`: Manage and store images in the cloud.
- `cookie-parser`: Handle cookies in Express.
- `cors`: Enable Cross-Origin Resource Sharing.
- `dotenv`: Load environment variables.
- `express`: Web application framework.
- `express-rate-limit`: Apply rate limits to APIs.
- `helmet`: Enhance HTTP security.
- `hpp`: Prevent HTTP parameter pollution.
- `joi`: Data validation.
- `jsonwebtoken`: Token-based authentication.
- `multer`: Middleware for handling multipart/form-data (file uploads).
- `pg` and `pg-hstore`: PostgreSQL support.
- `qrcode`: Generate QR codes.
- `sequelize`: ORM for database operations.
- `xss`: Prevent XSS attacks.

### Dev Dependencies:
- `@babel/preset-env`: Babel preset for JavaScript transpilation.
- `babel-jest`: Use Babel with Jest.
- `jest`: JavaScript testing framework.
- `supertest`: HTTP assertions for testing.

---

## Development

1. Ensure the required tools are installed: Node.js, npm, and PostgreSQL.
2. Configure the `.env` file with the correct variables.
3. Follow the installation steps and use the commands for development or production mode.

---

## License

This project is licensed under [MIT License](LICENSE).

---
```

This draft includes all critical sections, detailing project features, setup, usage, commands, dependencies, and more. Let me know if further adjustments are needed!
