# ⚙️ Setup and Configuration Guide

> [!NOTE]
> Dev Studio runs fully locally in your environment. This guide provides comprehensive, step-by-step instructions for installing dependencies, configuring databases, running migrations, and running the development server in a standard workspace setup.

---

## 🏗️ Step-by-Step Local Setup

Follow these steps to run Dev Studio on your local machine:

### 📥 1. Clone the Project
Open your terminal, clone the repository, and change directory into the workspace root.

### 📦 2. Install Project Dependencies
Use standard npm utility to install packages required for both the React client and Express server:
```bash
npm install
```

### 🔑 3. Configure Secrets (.env)
Create a `.env` file in the project's root folder. Dev Studio uses these variables at runtime:
```ini
PORT=5000
JWT_SECRET=use_a_strong_random_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/dev_studio_db
OPENAI_API_KEY=your_openai_key_here
```
> [!TIP]
> See [Environment Variables](./ENVIRONMENT.md) for a detailed reference of all supported variables.

### 💾 4. Spin up the Database Schema
Push the Drizzle-mapped database schema directly into your live local PostgreSQL instance:
```bash
npm run db:push
```

### 🚀 5. Boot the Development Servers
Start the unified Express 5 backend server combined with the Vite Dev HMR server:
```bash
npm run dev
```

The application will launch on **[http://localhost:5000](http://localhost:5000)**.

---

## 💻 Available Commands

You can run the following package scripts from the command line:

| Script | Command | Purpose |
|---|---|---|
| **dev** | `npm run dev` | Runs the Express server in development mode, proxying frontend requests to the Vite development bundle with dynamic hot module replacement (HMR). |
| **build** | `npm run build` | Builds a production-ready, highly optimized Single Page Application (SPA) static bundle under the `dist/` directory. |
| **db:push** | `npm run db:push` | Inspects your Drizzle schema exports and updates your live PostgreSQL database to match, without requiring standard migration boilerplate files. |
| **lint** | `npm run lint` | Analyzes code files for syntax validation and formatting guidelines using ESLint. |
| **format** | `npm run format` | Standardizes codebase formatting and alignment using Prettier. |

---

## 📂 Detailed Folder Structure

Understanding the layout of your Dev Studio workspace:

```
server/
  db/
    index.ts              # Drizzle ORM client connector and pool setup
  lib/
    openai.ts             # Centralized OpenAI service instantiator
  middleware/
    auth.ts               # JWT Cookie-based session verification middleware
  routes/
    api/                  # Individual REST resource routers
      auth.ts             # Password/Google OAuth authentication endpoints
      chat.ts             # Local chatbot routes calling OpenAI service
      cv.ts               # CV creation parser routes
      planner.ts          # Career roadmap planners calling OpenAI service
      prompts.ts          # Prompt library CRUD endpoints
      agents.ts           # AI Agent library CRUD endpoints
      components.ts       # Code component CRUD endpoints
      snippets.ts         # Multilingual snippet CRUD endpoints
      templates.ts        # Starter template CRUD endpoints
      connectors.ts       # Integration connection CRUD endpoints
      social.ts           # Social draft post CRUD endpoints
      mail.ts             # Email template CRUD endpoints
      interview.ts        # Interview prep CRUD endpoints
      jobs.ts             # Job tracking CRUD endpoints
  routes.ts               # Root API registration handler
  server.ts               # Core server engine boot and Vite dev runner
shared/
  schema/                 # Modular tables and schema groupings
  schema.ts               # Source of truth exports for Drizzle ORM
src/
  routes/                 # TanStack Router layouts and pages
  components/             # UI elements (buttons, inputs, grids)
  hooks/                  # Custom React hooks (useAuth, useMobile)
  lib/
    store.ts              # Zustand client state and actions manager
    api.ts                # Client API requests wrapper
  types/                  # TypeScript interface definitions
```

---

## 🔗 Related Setup Resources

- 🌐 [Environment Configuration](./ENVIRONMENT.md) — Comprehensive guide to variables.
- 🔑 [API Credentials Setup](./CREDENTIALS_SETUP.md) — Setting up Google OAuth and Slack Webhooks.
- 📐 [Architecture Overview](../architecture/README.md) — System design and request pipeline.
