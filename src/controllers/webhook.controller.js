const axios = require("axios");

async function sendToDiscordWebhook(message) {
  const webhookUrl = "https://message.style/api/send-message/webhook";

  try {
    await axios.post(webhookUrl, {
      webhook_id: "1230077411354476565",
      webhook_token:
        "JM4tFZJUpupnp1L-gdozsBtbLJ84061XJiTLfexezZONiThOjt6uJuh7u7jzb_Rc0hSo",
      data: {
        content: message,
      },
    });
  } catch (error) {
    throw error;
  }
}

module.exports.pushWebhook = async (req, res) => {
  const body = req.body;
  const eventType = req.headers["x-github-event"];

  if (eventType === "pull_request") {
    const action = body.action;
    const prUrl = body.pull_request.html_url;
    const isMerged = action === "closed" && body.pull_request?.merged;
    const isClosed = action === "closed" && !body.pull_request?.merged;

    if (action === "opened") {
      await sendToDiscordWebhook(`MR Opened: ${prUrl}`);
    } else if (isMerged) {
      await sendToDiscordWebhook(`MR Merged: ${prUrl} `);
    } else if (isClosed) {
      await sendToDiscordWebhook(`MR Closed: ${prUrl} `);
    }
  } else if (eventType === "status") {
    const state = body.state;
    const commitUrl = body.target_url;

    if (state === "success" || state === "failure") {
      await sendToDiscordWebhook(
        `Pipeline status: ${state.toUpperCase()} (${commitUrl})`
      );
    }
  }

  res.status(200).json({ message: "Webhook received successfully" });
};
