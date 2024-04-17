const axios = require("axios");

async function sendToDiscordWebhook(message) {
  const webhookUrl =
    "https://discord.com/api/webhooks/1230077411354476565/JM4tFZJUpupnp1L-gdozsBtbLJ84061XJiTLfexezZONiThOjt6uJuh7u7jzb_Rc0hSo/github";

  try {
    await axios.post(webhookUrl, { content: message });
  } catch (error) {
    throw error;
  }
}

module.exports.createWebhook = async (req, res) => {
  const body = req.body;
  const eventType = req.headers["x-github-event"];

  if (eventType === "pull_request") {
    const action = body.action;
    const prTitle = body.pull_request.title;
    const prUrl = body.pull_request.html_url;

    if (action === "opened") {
      await sendToDiscordWebhook(
        `New pull request opened: ${prTitle} (${prUrl})`
      );
    } else if (action === "closed" && body.pull_request.merged) {
      await sendToDiscordWebhook(`Pull request merged: ${prTitle} (${prUrl})`);
    }
  } else if (eventType === "status") {
    const state = body.state;
    const commitUrl = body.target_url;

    if (state === "success" || state === "failure") {
      await sendToDiscordWebhook(
        `Pipeline status changed: ${state.toUpperCase()} (${commitUrl})`
      );
    }
  }

  res.status(200).json({ message: "Webhook received successfully" });
};
