# 🔑 API Credentials and Integrations Setup

> [!NOTE]
> Dev Studio is built with standard passport.js authentication and outbound API integrations. This guide outlines how to easily configure database connections, set up local secure auth, register Google OAuth credentials, and connect your server to Slack.

---

## 🗄️ 1. Database Connection (PostgreSQL)

Dev Studio uses PostgreSQL for data persistence. You can run Postgres locally or connect to a managed cloud database.

### 💻 Running PostgreSQL Locally
If you do not have Postgres installed:
1. Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
2. Create a database named `dev_studio_db`.
3. Set your connection string in your local `.env` file under the key `DATABASE_URL`:
   ```ini
   DATABASE_URL=postgresql://postgres:your_db_password@localhost:5432/dev_studio_db
   ```
4. Synchronize the schema by running:
   ```bash
   npm run db:push
   ```

---

## 🔐 2. Authentication

Dev Studio supports two modes of authentication out of the box.

### 📧 Mode A: Standard Email & Password (Local & Default)
- **Zero setup required.**
- Users can register a new account on the login page immediately.
- Passwords are securely hashed on the backend using `bcryptjs` (12 rounds) and verified locally.
- Session authorization is handled via a secure `httpOnly` signed JWT cookie (`ds_token`).

### 🌐 Mode B: Sign-in with Google (OAuth 2.0)
To enable modern social sign-in:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Configure Consent Screen**, fill out the basic app details, and save.
5. Click **Create Credentials** > **OAuth Client ID**.
6. Select **Web Application** as the application type.
7. Under **Authorized Redirect URIs**, add your local development callback URL:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
8. Copy the generated **Client ID** and **Client Secret** into your `.env` file:
   ```ini
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```
9. Restart your local server. The "Sign in with Google" button will be activated automatically!

---

## 💬 3. Slack Webhooks (Optional)

To enable server-side automated message updates into your Slack channels:

1. Visit the [Slack App Directory](https://api.slack.com/apps) and click **Create New App**.
2. Select **From scratch**, name your app (e.g., `Dev Studio Hub`), and select your active Slack workspace.
3. Under the features sidebar, select **Incoming Webhooks** and click **Activate Incoming Webhooks**.
4. Scroll to the bottom and click **Add New Webhook to Workspace**.
5. Choose the channel you want the notifications to post to, and click **Authorize**.
6. Copy the generated webhook URL (starts with `https://hooks.slack.com/services/...`).
7. Add the webhook URL to your local `.env` file:
   ```ini
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   ```
8. (Optional) To verify signature payloads of incoming requests, add your **Signing Secret** from the App's Basic Information tab:
   ```ini
   SLACK_SIGNING_SECRET=your_slack_signing_secret_here
   ```
