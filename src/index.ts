import express from "express";
import {prepareAlchemyData, validateAlchemySignature} from "./utils/alchemy";
import {processPoolSwapEvent} from "./controllers/webhooks";
import cron from "node-cron";

import "dotenv/config";
import {publishPointsStats} from "./utils/dextools";
import {publishFarcasterLeaderboard} from "./utils/airstack/functions/fetch-token-holders";

// init express app
export const app = express();

app.use(express.json({limit: "10mb"}));

app.post(
  "/webhooks/token/swaps",
  // Middlewares needed to validate the alchemy signature
  prepareAlchemyData(),
  validateAlchemySignature(process.env.ALCHEMY_WEBHOOK_SIGNING_KEY_SWAP),
  processPoolSwapEvent
);

/*
TODO: Uncomment this code to enable the transfer event webhook
app.post(
  "/webhooks/token/transfers",
  // Middlewares needed to validate the alchemy signature
  prepareAlchemyData(),
  validateAlchemySignature(process.env.ALCHEMY_WEBHOOK_SIGNING_KEY_TRANSFER),
  processTransferEvent
);
*/

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});

// run every 1 hour
cron.schedule("0 * * * *", async () => {
  console.log("Elaborating Point stats...");
  try {
    await publishPointsStats();
  } catch (e) {
    console.error(e);
    await publishPointsStats();
  }
});

// run every hour at 30 minutes
cron.schedule("30 */2 * * *", async () => {
  console.log("Elaborating Farcaster leaderboard");
  try {
    await publishFarcasterLeaderboard(10);
  } catch (e) {
    console.error(e);
    await publishFarcasterLeaderboard(10);
  }
});
