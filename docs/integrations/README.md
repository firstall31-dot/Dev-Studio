# 🔌 Integration Guide

> [!NOTE]
> Dev Studio can be connected to external communication services and tools to automate notifications and log tasks. This document covers how to connect with Slack Webhooks and extend the integration endpoints safely.

---

## 💬 Slack Notification Webhooks

Dev Studio can dispatch automated notifications directly to a Slack channel when key system events occur.

### 🛠️ Configuration Setup

1. **Register a Slack Application**:
   Go to [api.slack.com/apps](https://api.slack.com/apps) and create a custom Slack app.
2. **Activate Incoming Webhooks**:
   Under the application features dashboard, navigate to **Incoming Webhooks** and switch the toggle to **Active**.
3. **Generate a Webhook URL**:
   Scroll to the bottom, click **Add New Webhook to Workspace**, select the target channel, and authorize the hook. Copy the generated URL string.
4. **Define Local Environment Secret**:
   Open your local `.env` file and define `SLACK_WEBHOOK_URL`:
   ```ini
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
   ```
5. **Verify Request Signature (Optional)**:
   To enable signature validation on incoming Slack webhooks, copy your **Signing Secret** from the Slack Basic Info panel and add it to `.env`:
   ```ini
   SLACK_SIGNING_SECRET=your_slack_signing_secret_here
   ```

---

## 🚀 Adding Custom Integrations

Dev Studio enforces a secure, decoupled communication pattern for all integrations:

> [!WARNING]
> **Outbound Security Gate**: All outgoing API requests to third-party endpoints MUST originate server-side. Never execute direct outbound third-party API calls from client browser code.

### 📝 Step-by-Step Integration Pattern
To register a new integration safely:
1. **Store Tokens Privately**: Add all credentials or API keys as private keys in your root `.env` file (e.g., `GITHUB_TOKEN=...`). Never check private keys into version control.
2. **Expose an Express Route Handler**: Build a route under `server/routes/api/` (e.g., `server/routes/api/github.ts`) that verifies the user's active session, reads the local environment variable securely using `process.env`, and performs the third-party HTTP call.
3. **Register the Router**: Export and import your custom API router within [server/routes.ts](file:///c:/Users/Memo/Downloads/Dev%20Studio/Dev-Studio/server/routes.ts).
4. **Consume the Endpoint in React**: Trigger the Express endpoint from client views using your custom REST API connector layer or Zustand store actions.
