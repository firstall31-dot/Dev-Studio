# 🌌 Dev Studio

> **Your ultimate personal AI-powered development hub.** Dev Studio provides a centralized, local-first control center to organize, version, test, and instantly run prompts, AI agents, React components, snippets, project templates, and technical interview preparation.

---

## ✨ Features

- 📝 **Prompts** — A robust library with parameters, template variable parser, favorite tags, and visual version history.
- 🤖 **AI Agents** — Custom AI agents with customizable system instructions, model selection, temperature control, and custom tools.
- 🧩 **React Components** — Reusable code blocks with automatic dependency mapping, styling configurations, and utility metadata.
- 📦 **Templates** — Standard software project structures complete with dynamic technology stack descriptors and structural layouts.
- 📎 **Snippets** — Multilingual code snippets organized with smart language filters, searchable descriptions, and syntax highlighting.
- 🧠 **Interview Prep** — A structured learning library and Q&A bank categorized by tech areas (frontend, backend, DevOps, databases) and difficulty levels.
- 🛡️ **Tech Skills Checklist** — Detailed interactive lists to track your career progression across key software engineering domains.
- 👥 **Soft Skills Track** — A curated communication module focusing on active listening, problem-solving, and collaboration.
- 📢 **Social & Email Drafts** — Ready-to-go post copy and email templates for major channels with token substitution.

---

## 🛠️ The Tech Stack

Dev Studio is built on a high-performance, modern React and Node.js stack designed for lightning-fast HMR and solid type safety.

| Layer | Component | Description |
|---|---|---|
| 🎨 **Frontend** | **React 19** | Custom components with modern hooks and fast reconciliation |
| 🔀 **Routing** | **TanStack Router** | Strongly typed, file-based routing architecture |
| 🔄 **Querying** | **TanStack Query** | State-of-the-art async data fetching and state caching |
| 💾 **State** | **Zustand** | Lightweight, responsive state store synchronized with local storage |
| 💅 **Styling** | **Tailwind CSS v4** | CSS-first configuration and atomic component classes |
| 🏗️ **UI Kit** | **shadcn/ui** | Clean, responsive component library |
| ⚙️ **Backend** | **Express 5** | High-performance HTTP server running on [server.ts](file:///c:/Users/Memo/Downloads/Dev%20Studio/Dev-Studio/server.ts) |
| ⚡ **ORM** | **Drizzle ORM** | Strictly-typed database queries and migrations |
| 🗄️ **Database** | **PostgreSQL** | Local persistence supporting active connection pooling |
| 🛠️ **Build System** | **Vite** | Fast local compilation and dynamic Hot Module Replacement (HMR) |
| 🛡️ **Language** | **TypeScript** | 100% strict type safety across the entire repository |

---

## 🚀 Local Development Setup

Dev Studio runs fully in your local workspace. Follow these steps to spin up the server:

### 📋 Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **PostgreSQL** v15 or higher running locally (or a remote PostgreSQL connection string)

---

### 📦 Step 1: Install Dependencies

Install the node modules inside your local project directory:
```bash
npm install
```

---

### 🔑 Step 2: Configure Environment Variables

Create a file named `.env` in the root of the project directory. Add the following environment variables:

```ini
# Server Setup
PORT=5000
JWT_SECRET=super_secret_session_jwt_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev_studio

# AI Configuration (Optional, required for AI generator & chat tools)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Google OAuth Configuration
# GOOGLE_CLIENT_ID=your_google_client_id_here
# GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Optional: Slack Integration
# SLACK_WEBHOOK_URL=your_slack_webhook_url_here
# SLACK_SIGNING_SECRET=your_slack_signing_secret_here
```

> [!TIP]
> You can copy `.env.example` to `.env` using your local shell and replace the placeholder values.

---

### 📊 Step 3: Initialize the Database Schema

Push the database tables to your local PostgreSQL instance using Drizzle ORM:
```bash
npm run db:push
```

---

### 💻 Step 4: Run the Application

Start the local development server (which compiles the frontend under Vite and boots the Express backend simultaneously):
```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:5000](http://localhost:5000)**.

---

## 💻 Available Scripts

You can execute the following NPM commands in your workspace:

| Script | Command | Description |
|---|---|---|
| 🏃 **Dev Mode** | `npm run dev` | Runs Express server + Vite Dev Middleware with HMR |
| 🧱 **Production Build** | `npm run build` | Compiles the production SPA bundle into the `dist/` folder |
| 💾 **Drizzle Push** | `npm run db:push` | Pushes local changes in Drizzle schema to your live database |
| 🛡️ **TypeScript Check** | `npx tsc --noEmit` | Runs strict type checking over client and server code |
| 🔍 **ESLint Check** | `npm run lint` | Analyzes code quality using ESLint |
| 💅 **Prettier Format** | `npm run format` | Standardizes codebase formatting with Prettier |

---

## 📂 Project Structure

```
.github/
  workflows/             # Custom GitHub CI/CD workflows
  CODE_OF_CONDUCT.md     # Harassment-free pledge and standards
  SECURITY.md            # Responsible vulnerability reporting guidelines
docs/                    # Detailed technical documentation
server/
  db/index.ts            # Drizzle ORM database connector and client
  lib/openai.ts          # Centralized OpenAI instantiator
  middleware/auth.ts     # JWT cookie session verification middleware
  routes/api/            # REST API endpoint routers (prompts, agents, snippets, etc.)
  routes.ts              # Primary root router registration
  server.ts              # Express configuration and Vite development server middleware
shared/
  schema/                # Specialized schema files (auth, core, planner, chat, etc.)
  schema.ts              # Unified Drizzle ORM database exports
src/
  routes/                # TanStack Router pages and sub-layouts
  components/            # UI components (prompts, agents, skills, auth)
  hooks/                 # React state hooks (useAuth, useMobile)
  lib/
    store.ts             # Zustand store - frontend source of truth
    api.ts               # Custom REST client for client-server integration
  types/                 # Strict type mappings
vite.config.ts           # Vite compile configuration with development proxy settings
```

---

## 📖 Additional Documentation

Discover more about the Dev Studio architecture and integrations under the `docs/` folder:

* 📐 [System Architecture](./docs/architecture/README.md) — Comprehensive design and request pipeline.
* 💾 [Data Models & Schema](./docs/architecture/DATA_MODELS.md) — Drizzle schema properties and relations.
* 🔐 [Setup & Environment Configuration](./docs/setup/README.md) — Deep dive into environment variables.
* 🔑 [API Credentials Setup](./docs/setup/CREDENTIALS_SETUP.md) — External API setup guide.
* 🔌 [Integration Center](./docs/integrations/README.md) — Setting up webhooks and server hooks.
* 🤝 [Contributing Guidelines](./docs/CONTRIBUTING.md) — Standard workflow for raising Pull Requests.
