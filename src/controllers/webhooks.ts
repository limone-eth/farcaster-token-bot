import {Request, Response} from "express";
import {AlchemyWebhookEvent} from "../utils/alchemy";
import {constants} from "../constants";
import {decodeTransferEvent} from "../utils/smart-contracts/decode-events";

export async function processWebhookEvent(
  req: Request,
  res: Response
): Promise<void> {
  const webhookEvent = req.body as AlchemyWebhookEvent;
  const logs = webhookEvent.event?.data?.block?.logs;
  if (!logs || logs?.length === 0) {
    console.log(
      `No logs found in webhook event at ${new Date().toISOString()}`
    );
    res.json({message: "No logs found in webhook event"});
    return;
  }
  const logsData: {data: string; topics: string[]} = logs.find(
    (l) => l.topics[0] === constants.TOKEN_SMART_CONTRACT.TRANSFER_EVENT_TOPIC
  );
  console.log("Logs found in webhook event", logsData);
  const {to, amount} = decodeTransferEvent(logsData.topics, logsData.data);
  console.log("Decoded register event", {to, amount});

  /**
   * Do things here with the received data
   * e.g., save to database, send to analytics, etc.
   */

  res.json({message: "Successfully processed webhook event"});
}
