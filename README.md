# Velocity Torque Nation: Creation

Velocity Torque Nation: Creation is a MERN-powered 3D racing prototype that combines a secure authentication flow with a Three.js-powered driving experience. MongoDB stores account data, Express exposes protected routes, React handles the UI, and Three.js renders the track in the browser.

## Features

- Secure registration and login with bcrypt-hashed passwords
- JWT-based session handling with a protected `/game` route
- React Router v6 navigation with guarded access
- Local storage token persistence and automatic session restoration
- Three.js third-person racing scene with WASD/arrow controls and nitro boost
- Responsive UI with custom styling and HUD overlays

## Project Structure

```
velocity torque nation/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.js
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   └── NavBar.jsx
│       ├── pages/
│       │   ├── Game.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── providers/
│       │   └── AuthProvider.jsx
│       ├── services/
│       │   └── apiClient.js
│       └── three/
│           └── GameScene.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)

## Environment Variables

Create `backend/.env` (already scaffolded) and update the placeholders:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/velocity-torque-nation
JWT_SECRET=replace_me_with_a_long_random_string
CLIENT_URL=http://localhost:5173
```

> Use a strong random value for `JWT_SECRET`. The `CLIENT_URL` should match where the React app runs.

## Installation

From the project root (`velocity torque nation/`):

```powershell
npm run install:all
```

This installs dependencies for both backend and frontend workspaces.

## Running the App

### Development mode (frontend + backend together)

```powershell
npm run dev
```

- Backend listens on `http://localhost:5000`
- Frontend Vite dev server runs on `http://localhost:5173`
- API requests from the frontend proxy automatically to the backend

### Backend-only production start

```powershell
npm start
```

The backend uses the compiled React build only if you deploy the frontend separately. For production hosting, build the frontend and serve the static output via your preferred method.

### Building the frontend for production

```powershell
cd frontend
npm run build
```

The compiled assets land in `frontend/dist/`.

## Usage Flow

1. Visit `http://localhost:5173/register` to create a new account.
2. Log in at `http://localhost:5173/login`. Successful login stores the JWT in `localStorage`.
3. Once authenticated, navigate to `/game` to launch the Three.js racer. Unauthenticated users are redirected to `/login`.
4. Use `WASD` or arrow keys to steer, and hold `Shift` for a nitro-inspired boost.

## Testing Tips

- Inspect network calls in your browser devtools to ensure JWT headers are present.
- Verify MongoDB contains encrypted passwords (bcrypt hashes) rather than plaintext values.
- Update `CLIENT_URL` when running from a different host/port to satisfy CORS.

## Extending the Project

- Swap the placeholder cube car for a GLTF import via `GLTFLoader`.
- Persist high scores or garage configurations in MongoDB.<br>
- Introduce socket-based multiplayer for real-time races.

Enjoy building and racing!
