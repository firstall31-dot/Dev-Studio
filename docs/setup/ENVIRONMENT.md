# 🌐 Environment Variables Configuration

> [!NOTE]
> Dev Studio reads configuration options and integration credentials from your environment or a local `.env` file loaded at boot time. This guide outlines every supported variable and how to configure them in your local workspace.

---

## 📂 The `.env` Configuration File

To set environment variables locally, create a file named `.env` in the root of the project. A template of standard settings is provided below:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secure_unpredictable_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev_studio

# Artificial Intelligence (AI)
OPENAI_API_KEY=sk-proj-...

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Optional: Slack Webhook Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_SIGNING_SECRET=your_slack_signing_secret_here
```

---

## 📋 Comprehensive Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | 🟡 No | `5000` | The port that the local Express server listens on. |
| `NODE_ENV` | 🟡 No | `development` | The environment setting. Set to `production` in production deployment. |
| `JWT_SECRET` | 🟢 **Yes** | — | A unique, secret string used to sign JWT cookies for user authentication sessions. Keep this secret! |
| `DATABASE_URL` | 🟢 **Yes** | — | The full connection string for your local or remote PostgreSQL database. Format: `postgresql://user:pass@host:port/dbname` |
| `OPENAI_API_KEY` | 🟡 No | — | Required for AI generation features. This is used by the Prompt Generator, CV Parser, AI Roadmaps, and local AI Chat bots. |
| `GOOGLE_CLIENT_ID` | 🟡 No | — | Client ID from the Google Cloud Console. Enables "Sign in with Google" OAuth. |
| `GOOGLE_CLIENT_SECRET` | 🟡 No | — | Client Secret from the Google Cloud Console. Required for Google OAuth. |
| `SLACK_WEBHOOK_URL` | 🟡 No | — | Enables the system to send automated logs or notification messages into a Slack channel. |
| `SLACK_SIGNING_SECRET` | 🟡 No | — | Signature validation key from your Slack App dashboard to verify incoming hooks. |

---

## 🛡️ Best Security Practices

> [!CAUTION]
> - **Never commit `.env` files to git.** The `.gitignore` is pre-configured to ignore `.env`, but always verify that your secrets are kept locally.
> - Avoid using plain, easily guessed values for `JWT_SECRET`. Use a random hexadecimal string (e.g., generated with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
> - In standard production deployments, use your hosting provider's native Environment Variables manager (like Vercel, Netlify, Render, or Railway environment variables settings) instead of hardcoded `.env` files.
