import express from "express";
import {prepareAlchemyData, validateAlchemySignature} from "./utils/alchemy";
import {processWebhookEvent} from "./controllers/webhooks";
import "dotenv/config";

// init express app
export const app = express();

app.use(express.json({limit: "10mb"}));

app.post(
  "/webhooks/points",
  // Middlewares needed to validate the alchemy signature
  prepareAlchemyData(),
  validateAlchemySignature(process.env.ALCHEMY_WEBHOOK_SIGNING_KEY),
  processWebhookEvent
);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
