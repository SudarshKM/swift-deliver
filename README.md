# SwiftDeliver Backend API

A robust backend service for the SwiftDeliver application, built with Node.js, Express, TypeScript, and MongoDB. The API features a secure authentication system utilizing JSON Web Tokens (JWT) and refresh tokens.

## 🚀 Technologies

- **Node.js** & **Express**: Fast, unopinionated web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB** & **Mongoose**: NoSQL database and object modeling tool.
- **JWT (JSON Web Tokens)**: Secure standard for authentication and authorization.
- **Bcryptjs**: Password hashing.
- **Jest** & **Supertest**: Testing frameworks for unit and integration tests.

## 📂 Project Structure

```
swift-deliver/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Request handlers for routes
│   ├── middleware/    # Authentication and authorization middlewares
│   ├── models/        # Mongoose database models
│   ├── routes/        # API route definitions
│   ├── utils/         # Helper functions (e.g., JWT generation)
│   └── server.ts      # Application entry point
├── tests/             # Jest tests
├── .env               # Environment variables
├── package.json       # Project metadata and dependencies
└── tsconfig.json      # TypeScript compiler configuration
```

## 🛠️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/swift-deliver.git
   cd swift-deliver
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=5005
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. **Start the Application:**

   - **Development Mode:**
     ```bash
     npm run dev
     ```
   - **Production Mode:**
     ```bash
     npm start
     ```

## 🔑 API Endpoints

### Health Check

- `GET /health` - Returns the health status of the backend API.
- `GET /register` - Returns register API open status.

### Authentication (`/v1/auth`)

- `POST /v1/auth/register` - Register a new user.
- `POST /v1/auth/login` - Authenticate a user and receive tokens.
- `POST /v1/auth/refresh` - Refresh the access token using a valid refresh token.
- `POST /v1/auth/logout` - Logout a user and invalidate tokens.
- `GET /v1/auth/user-status` - Retrieve the current authenticated user's status.

### Protected Routes (`/v1/protected`)

- `GET /v1/protected` - An example of an authenticated route that returns user info.

## 🛡️ Authentication & Security

- **Access Tokens:** Short-lived tokens (e.g., 15 minutes) used to authenticate requests.
- **Refresh Tokens:** Long-lived tokens (e.g., 7 days) securely stored as HTTP-only cookies to obtain new access tokens without re-authenticating.
- **Middlewares:**
  - `authenticate`: Verifies the access token provided in the Authorization header.
  - `authorize(roles[])`: Ensures the authenticated user has the necessary role to access the route.

## 🧪 Testing

The project uses Jest and Supertest to test endpoints.

To run the test suite:

```bash
npm test
```

## 📄 License

This project is licensed under the ISC License.
