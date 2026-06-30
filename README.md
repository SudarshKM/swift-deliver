# SwiftDeliver Backend API

A robust backend service for the SwiftDeliver application, built with Node.js, Express, TypeScript, MongoDB, and Redis. The API features a secure authentication system utilizing JSON Web Tokens (JWT) and refresh tokens, with Redis-powered caching for high-performance data retrieval, and Redis-backed rate limiting to protect against abuse.

## 🚀 Technologies

- **Node.js** & **Express**: Fast, unopinionated web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB** & **Mongoose**: NoSQL database and object modeling tool.
- **Redis** & **ioredis**: In-memory data store used for caching.
- **Docker** & **Docker Compose**: Containerized development and deployment.
- **JWT (JSON Web Tokens)**: Secure standard for authentication and authorization.
- **Bcryptjs**: Password hashing.
- **Zod**: TypeScript-first schema validation.
- **Helmet**: Express middleware to secure HTTP headers.
- **express-rate-limit** & **rate-limit-redis**: Redis-backed API rate limiting.
- **Jest** & **Supertest**: Testing frameworks for unit and integration tests.

## 📂 Project Structure

```
swift-deliver/
├── src/
│   ├── config/        # Database and Redis configuration
│   ├── controllers/   # Request handlers for routes
│   ├── middleware/    # Auth, rate limiting, validation, and error handling
│   ├── models/        # Mongoose database models (User, Restaurant, Product, Order)
│   ├── routes/        # API route definitions
│   ├── types/         # TypeScript type definitions and enums
│   ├── utils/         # Helper functions (e.g., JWT generation)
│   └── server.ts      # Application entry point
├── tests/             # Jest tests
├── .env               # Environment variables
├── docker-compose.yml # Docker Compose configuration
├── Dockerfile         # Multi-stage Docker build
├── .dockerignore      # Docker build context exclusions
├── package.json       # Project metadata and dependencies
└── tsconfig.json      # TypeScript compiler configuration
```

## 🛠️ Setup & Installation

### Docker (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/swift-deliver.git
   cd swift-deliver
   ```

2. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=5005
   MONGODB_URI=mongodb://mongo:27017/swift-deliver
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REDIS_HOST=redis
   STRICT_POLICY=throw
   ```

3. **Start all services with Docker Compose:**

   ```bash
   docker compose up --build
   ```

   This starts the **app** (port 5005), **MongoDB** (port 27017), and **Redis** (port 6379) containers.

4. **Stop the services:**

   ```bash
   docker compose down
   ```

   Use `docker compose down -v` to also remove persistent volumes.

### Local (Without Docker)

1. **Prerequisites:** Ensure MongoDB and Redis are running locally.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file with:

   ```env
   PORT=5005
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REDIS_HOST=localhost
   STRICT_POLICY=throw
   ```

4. **Start the Application:**

   - **Development Mode:**
     ```bash
     npm run dev
     ```
   - **Production Mode:**
     ```bash
     npm run build
     npm start
     ```

## 🔑 API Endpoints

### Health Check

- `GET /health` - Returns the health status of the backend API and Redis connectivity.
  ```json
  { "status": "healthy", "message": "SwiftDeliver Backend", "redis": "connected" }
  ```
- `GET /register` - Returns register API open status.

### Authentication (`/v1/auth`)

- `POST /v1/auth/register` - Register a new user.
- `POST /v1/auth/login` - Authenticate a user and receive tokens.
- `POST /v1/auth/refresh` - Refresh the access token using a valid refresh token.
- `POST /v1/auth/logout` - Logout a user and invalidate tokens.
- `GET /v1/auth/user-status` - Retrieve the current authenticated user's status.

### Protected Routes (`/v1/protected`)

- `GET /v1/protected` - An example of an authenticated route that returns user info.

### Restaurants (`/v1/restaurants`)

- `POST /v1/restaurants` - Create a new restaurant (Requires 'restaurant' role).
- `GET /v1/restaurants` - Get a list of active restaurants. *(Redis cached — 1 hour TTL)*
- `GET /v1/restaurants/:id/menu` - Get the menu (products) for a specific restaurant.

### Products (`/v1/products`)

- `POST /v1/products/add-product` - Add a new product to a restaurant's menu (Requires 'restaurant' role).

### Orders (`/v1/orders`)

- `POST /v1/orders/create-order` - Create a new order (Requires 'customer' role).

## 🛡️ Authentication & Security

- **Access Tokens:** Short-lived tokens (e.g., 15 minutes) used to authenticate requests.
- **Refresh Tokens:** Long-lived tokens (e.g., 7 days) securely stored as HTTP-only cookies to obtain new access tokens without re-authenticating.
- **Rate Limiting:** All `/v1` endpoints are rate-limited to **100 requests per 15 minutes** per IP, backed by Redis for distributed state.
- **Middlewares:**
  - `authenticate`: Verifies the access token provided in the Authorization header.
  - `authorize(roles[])`: Ensures the authenticated user has the necessary role (e.g., `admin`, `restaurant`, `customer`, `delivery`) to access the route.
  - `apiLimiter`: Redis-backed rate limiter applied to all `/v1` routes.

## 🐛 Debugging (VS Code)

The project includes a pre-configured VS Code debug setup that runs Redis and MongoDB in Docker while launching the app locally with `ts-node`.

1. Ensure Docker is running.
2. Open the **Run and Debug** panel (`Ctrl+Shift+D`).
3. Select **"Debug Server (ts-node)"** and press **F5**.

This will:
- Auto-start `mongo` and `redis` containers via the `docker-infra-up` pre-launch task.
- Launch the app locally with `REDIS_HOST=localhost` so it connects to the Docker-exposed ports.
- Enable breakpoints in all `.ts` source files.

## 🧪 Testing

The project uses Jest and Supertest to test endpoints.

To run the test suite:

```bash
npm test
```

## 📄 License

This project is licensed under the ISC License.
