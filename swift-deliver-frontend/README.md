# SwiftDeliver Frontend

The user-facing client application for SwiftDeliver, built with React, TypeScript, and Vite. This application interfaces with the backend service to provide user authentication, restaurant and menu browsing, and real-time order tracking using WebSockets.

## 🚀 Technologies

- **React 19**: Modern component-based library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast hot module replacement (HMR).
- **TypeScript**: Static typing for JavaScript, ensuring code reliability and robustness.
- **Axios**: Promise-based HTTP client for API communication.
- **Socket.io-client**: Real-time bidirectional event-based communication for order updates.

## 📂 Project Structure

```
swift-deliver-frontend/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, SVG graphics, and stylesheet resources
│   ├── components/    # Reusable UI widgets and layout components
│   ├── pages/         # Page-level components and views
│   ├── services/      # Communication modules
│   │   ├── api.ts     # Axios instance & token forwarding interceptor
│   │   └── socket.ts  # Socket.io connection instance and auth helpers
│   ├── App.css        # App-wide visual styles
│   ├── App.tsx        # Root component
│   ├── index.css      # Core style definitions and tailwind/design tokens
│   ├── main.tsx       # Entry point for Vite rendering
│   └── vite-env.d.ts  # TypeScript environment declarations
├── eslint.config.js   # ESLint configuration
├── index.html         # HTML template
├── package.json       # Project dependencies and script actions
├── tsconfig.json      # TypeScript root config
└── vite.config.ts     # Vite builder configuration
```

## 🛠️ Setup & Run

### Docker (Recommended)
To run the frontend as part of the full Docker stack:
1. Navigate to the root folder `swift-deliver` and start services:
   ```bash
   docker compose up --build
   ```
2. Configure `.env` in the `swift-deliver-frontend` folder to route API/socket traffic through the Nginx proxy (port 80):
   ```env
   VITE_API_BASE_URL=/api/v1
   VITE_SOCKET_URL=/
   ```

### Standalone Local Development (Without Docker)
To run the frontend server individually on your host machine:

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

2. **Configure Environment Variables**:
   Create a `.env` file in the `swift-deliver-frontend` folder to talk directly to your locally running backend server (port 5005):
   ```env
   VITE_API_BASE_URL=http://localhost:5005/v1
   VITE_SOCKET_URL=http://localhost:5005
   ```

### 3. Install Dependencies
Run the following command:
```bash
npm install
```

### 4. Run Development Server
Start the local server with hot reload support:
```bash
npm run dev
```
The application will run by default on [http://localhost:5173/](http://localhost:5173/).

### 5. Build for Production
To build static assets for deployment:
```bash
npm run build
```
Verify the build locally by previewing:
```bash
npm run preview
```

## 🔌 Connection Services

### HTTP API Client (`src/services/api.ts`)
The `api` export handles REST communication with the backend. It has an **Authorization interceptor** that automatically reads the `token` stored in your browser's `localStorage` and appends it to all requests:
```typescript
import api from './services/api';

// Example call:
const getRestaurants = () => api.get('/restaurants');
```

### WebSockets (`src/services/socket.ts`)
The `socket` client handles real-time events. It provides lifecycle helpers to start and stop websocket channels:
```typescript
import { connectSocket, disconnectSocket, socket } from './services/socket';

// Connect when a user logs in:
connectSocket(accessToken);

// Listen to order status updates:
socket.on('order-status-updated', (data) => {
  console.log(`Order ${data.orderId} is now ${data.status}`);
});

// Clean up on logout:
disconnectSocket();
```
