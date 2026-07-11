# SwiftDeliver (Monorepo)

Welcome to the **SwiftDeliver** project! This repository contains both the backend API and the frontend web application in a consolidated monorepo structure.

## 📂 Project Structure

* **[swift-deliver-backend/](file:///home/sudarshkm/swift-deliver/swift-deliver-backend)**: Node.js, Express, TypeScript, MongoDB, and Redis API service.
* **[swift-deliver-frontend/](file:///home/sudarshkm/swift-deliver/swift-deliver-frontend)**: React (v19) client application built using TypeScript and Vite.
* **[docker-compose.yml](file:///home/sudarshkm/swift-deliver/docker-compose.yml)**: Unified Docker Compose configuration to spin up the entire application stack.

---

## ⚡ Quick Start: Full Stack with Docker (Recommended)

To run the frontend, backend, databases, and message queue together:

1. **Configure Environment Variables**:
   * Create a `.env` file in **[swift-deliver-backend/](file:///home/sudarshkm/swift-deliver/swift-deliver-backend)** and configure your backend values (see [backend README](file:///home/sudarshkm/swift-deliver/swift-deliver-backend/README.md) for details).
   * Create a `.env` file in **[swift-deliver-frontend/](file:///home/sudarshkm/swift-deliver/swift-deliver-frontend)** and set it to route through the Nginx proxy (port 80):
     ```env
     VITE_API_BASE_URL=/api/v1
     VITE_SOCKET_URL=/
     ```

2. **Build and Run the Containers**:
   ```bash
   docker compose up --build
   ```

3. **Access Services**:
   * **Frontend Web App (includes proxy to API)**: [http://localhost](http://localhost) (port 80)
   * **Backend API (Direct Access)**: [http://localhost:5005](http://localhost:5005)
   * **MongoDB**: `localhost:27017`
   * **Redis**: `localhost:6379`

4. **Shutdown Stack**:
   ```bash
   docker compose down
   ```
   Add `-v` to clear persistent data volumes: `docker compose down -v`.

---

## 🛠️ Setup & Running Locally (Without Docker)

If you wish to run the client and API servers individually outside of Docker:

### 1. Backend Server
1. Make sure you have **MongoDB** and **Redis** running on your local machine.
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd swift-deliver-backend
   npm install
   ```
3. Set your environment variables in `swift-deliver-backend/.env` (pointing to `localhost` databases).
4. Run the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client
1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd swift-deliver-frontend
   npm install
   ```
2. Set your environment variables in `swift-deliver-frontend/.env` to point to the backend port 5005 directly:
   ```env
   VITE_API_BASE_URL=http://localhost:5005/v1
   VITE_SOCKET_URL=http://localhost:5005
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app at: [http://localhost:5173](http://localhost:5173)

---

## 🛡️ VS Code Debugging

Open the workspace root folder in VS Code. We have pre-configured a launch task inside [.vscode/](file:///home/sudarshkm/swift-deliver/.vscode):
1. Press `F5` or select **"Debug Server (ts-node)"** in the Run and Debug side menu.
2. VS Code will automatically start MongoDB and Redis using Docker (`docker compose up -d mongo redis`) and attach a debugger to the local ts-node backend server.
