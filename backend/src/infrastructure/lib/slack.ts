import crypto from "crypto";

interface SlackMessage {
  text: string;
  blocks?: Array<{
    type: string;
    text?: { type: string; text: string };
    fields?: Array<{ type: string; text: string }>;
    elements?: Array<{
      type: string;
      text: { type: string; text: string };
      url?: string;
    }>;
  }>;
}

export async function sendSlackNotification(
  message: SlackMessage,
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Slack webhook URL not configured");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    console.log("Slack notification sent successfully");
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}

export async function notifyDeployment(
  status: "success" | "failure",
  environment: string,
  commit?: string,
  author?: string,
): Promise<void> {
  const isSuccess = status === "success";
  const emoji = isSuccess ? "✅" : "❌";

  const message: SlackMessage = {
    text: `${emoji} Deployment ${status}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji} Deployment ${status.toUpperCase()}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Environment:*\n${environment}`,
          },
          {
            type: "mrkdwn",
            text: `*Status:*\n${status}`,
          },
          ...(commit
            ? [{ type: "mrkdwn", text: `*Commit:*\n\`${commit.slice(0, 7)}\`` }]
            : []),
          ...(author ? [{ type: "mrkdwn", text: `*Author:*\n${author}` }] : []),
        ],
      },
    ],
  };

  await sendSlackNotification(message);
}

export async function notifyError(
  error: Error,
  context?: Record<string, unknown>,
): Promise<void> {
  const message: SlackMessage = {
    text: "❌ Error occurred",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "❌ Error Occurred",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Error:*\n${error.message}`,
          },
          {
            type: "mrkdwn",
            text: `*Type:*\n${error.name}`,
          },
          ...(context
            ? Object.entries(context).map(([key, value]) => ({
                type: "mrkdwn",
                text: `*${key}:*\n${String(value)}`,
              }))
            : []),
        ],
      },
    ],
  };

  await sendSlackNotification(message);
}

export async function notifyBuild(
  status: "success" | "failure",
  branch: string,
  message?: string,
): Promise<void> {
  const isSuccess = status === "success";
  const emoji = isSuccess ? "✅" : "❌";

  const slackMessage: SlackMessage = {
    text: `${emoji} Build ${status}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji} Build ${status.toUpperCase()}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Branch:*\n${branch}`,
          },
          {
            type: "mrkdwn",
            text: `*Status:*\n${status}`,
          },
          ...(message
            ? [{ type: "mrkdwn", text: `*Message:*\n${message}` }]
            : []),
        ],
      },
    ],
  };

  await sendSlackNotification(slackMessage);
}

export function verifySlackSignature(
  body: string,
  timestamp: string,
  signature: string,
): boolean {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  if (!signingSecret) {
    console.warn("Slack signing secret not configured");
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    console.warn("Slack request timestamp too old");
    return false;
  }

  const baseString = `v0:${timestamp}:${body}`;
  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");
  const computedSignature = `v0=${hmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature),
  );
}
