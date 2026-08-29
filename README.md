# CompilerX
 **Live:** [compiler-x-ten.vercel.app](https://compiler-x-ten.vercel.app)
 
A MERN online code editor/compiler (Monaco + the Judge0 API for running
JavaScript, Python, Java, C, and C++ code).

## Structure

```
backend/
├── config/db.js                    # Mongo connection
├── controllers/                    # auth, project, execution
├── middleware/                     # authMiddleware (JWT cookie), validate (Zod), rateLimiter
├── models/                         # User, Project, Execution
├── routes/                         # authRoutes (/auth/*), projectRoutes (/*), executionRoutes (/*)
├── services/executionService.js    # runs code via the Judge0 API (see JUDGE0_API_URL in .env)
├── utils/                          # languages.js (shared language config), token.js (JWT + cookie helpers)
├── validators/                     # authValidators, projectValidators, executionValidators (Zod)
├── .env                            # local dev config (JWT_SECRET, MONGO_URI, etc.)
└── app.js

frontend/
├── src/constants/languages.js      # Monaco language ids + logos, mirrors backend/utils/languages.js
├── src/context/AuthContext.jsx     # auth state sourced from GET /auth/me, not localStorage
├── src/helper.js                   # apiFetch() - fetch wrapper that always sends cookies
├── src/pages/{Login,SignUp,Home,Editor}.jsx
└── src/components/Navbar.jsx
```

## Running locally

**Backend**
```bash
cd backend
npm install
# edit .env if needed (JWT_SECRET, MONGO_URI, CLIENT_ORIGIN)
npm start        # or: npm run dev  (auto-restart)
```
Requires:
- Node.js 18+
- A running MongoDB instance at `MONGO_URI`
- Local compilers/runtimes on PATH: `node`, `python3`, `gcc`, `g++`, and a JDK (`javac` + `java`)

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` by default; the backend's `CLIENT_ORIGIN` must match this for CORS + cookies to work.

## Auth model

Login/signup issue a JWT stored in an **httpOnly cookie** (not localStorage).
On app start, the React app calls `GET /auth/me`; the result (logged in or
not) drives all route protection via `AuthContext` - a stale client-side flag
can never leave the UI showing a protected page to a logged-out user. Every
project/execution route runs through `authMiddleware`, which verifies the
cookie and sets `req.user.id`. Every controller that touches a specific
project (`getProject`, `saveProject`, `editProject`, `deleteProject`,
`execute`, `getExecutionHistory`) re-checks `project.createdBy === req.user.id`
via a shared `findOwnedProject()` helper - the project ID alone is never trusted.

## Code execution

`POST /execute` takes `{ projectId, code, stdin }`. The backend looks up the
project's language itself (never trusts a client-supplied language), and
runs the code **locally** via `child_process` (no shell, argument arrays
only):

| Language   | Compile          | Run                    |
|------------|------------------|-------------------------|
| javascript | -                | `node main.js`         |
| python     | -                | `python3 main.py`      |
| c          | `gcc -O2 -o program` | `./program`         |
| cpp        | `g++ -O2 -o program` | `./program`         |
| java       | `javac Main.java`| `java -cp <dir> Main`  |

Java code must declare `public class Main` (the file is always written as
`Main.java`).

Every run gets its own temp directory (cleaned up afterward, success or
failure), a 5s run timeout / 10s compile timeout (both configurable via
`.env`), and returns a normalized
`{ success, type, output }` where `type` is one of
`success | compile_error | runtime_error | timeout | api_error`. Each run is
also logged to the `Execution` collection and shown in the editor's
"Execution History" panel (scoped to the owning user + project).

## Rate limiting

`express-rate-limit`, in-memory, per-process - 10 requests/minute on
login+signup and 10 requests/minute on `/execute`.

## Autosave

The editor waits ~1s after the user stops typing before saving (no request
per keystroke), and Ctrl+S saves immediately. Both paths share one
`saveProject()` call that no-ops if the code hasn't actually changed since
the last save.

