const express = require("express");
const router = express.Router();

// controllers
const webhookController = require("../controllers/webhook.controller");

router.post("/webhook/github", webhookController.pushWebhook);

module.exports = router;
