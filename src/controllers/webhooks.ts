import {Request, Response} from "express";
import {AlchemyWebhookEvent} from "../utils/alchemy";
import {constants} from "../constants";
import {decodeTransferEvent} from "../utils/smart-contracts/decode-events";
import {providers} from "ethers";
import {getFarcasterIdentity} from "../utils/web3-bio";
import {publishCast} from "../utils/farcaster";

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
  const logsData: {
    data: string;
    account: {address: string};
    topics: string[];
    transaction: {hash: string};
  } = logs.find((l) => l.topics[0] === constants.TRANSFER_EVENT_TOPIC);
  const txUrl = `https://zapper.xyz/event/ethereum/${logsData.transaction.hash}`;

  const provider = new providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
  const txReceipt = await provider.getTransactionReceipt(
    logsData.transaction.hash
  );

  const {from} = txReceipt;

  const wethIndex = txReceipt.logs.findIndex(
    (l) =>
      l.address.toLowerCase() ===
        constants.WRAPPED_ETH_SMART_CONTRACT_ADDRESS.toLowerCase() &&
      l.topics[0] === constants.TRANSFER_EVENT_TOPIC
  );

  const pointsIndex = txReceipt.logs.findIndex(
    (l) =>
      l.address.toLowerCase() ===
        constants.POINTS_SMART_CONTRACT_ADDRESS.toLowerCase() &&
      l.topics[0] === constants.TRANSFER_EVENT_TOPIC
  );

  const pointsTransferLogs = txReceipt.logs.find(
    (l) =>
      l.address.toLowerCase() ===
        constants.POINTS_SMART_CONTRACT_ADDRESS.toLowerCase() &&
      l.topics[0] === constants.TRANSFER_EVENT_TOPIC
  );

  const wrappedEthTransferLogs = txReceipt.logs.find(
    (l) =>
      l.address.toLowerCase() ===
        constants.WRAPPED_ETH_SMART_CONTRACT_ADDRESS.toLowerCase() &&
      l.topics[0] === constants.TRANSFER_EVENT_TOPIC
  );

  if (!wrappedEthTransferLogs || !pointsTransferLogs) {
    console.log(
      "No wrapped eth or points transfer logs found in webhook event",
      logsData
    );
    res.json({
      message: "No wrapped eth or points transfer logs found in webhook event",
    });
    return;
  }

  const wrappedEthData = decodeTransferEvent(
    wrappedEthTransferLogs.topics as string[],
    wrappedEthTransferLogs.data as string
  );

  const pointsData = decodeTransferEvent(
    pointsTransferLogs.topics as string[],
    pointsTransferLogs.data as string
  );

  try {
    const farcasterIdentity = await getFarcasterIdentity(from);
    let text;
    if (wethIndex > pointsIndex) {
      text = `@${farcasterIdentity} swapped ${wrappedEthData.amount.toLocaleString()} $WETH for ${pointsData.amount.toLocaleString()} $POINTS`;
    } else {
      text = `@${farcasterIdentity} swapped ${pointsData.amount.toLocaleString()} $POINTS for ${wrappedEthData.amount.toLocaleString()} $WETH`;
    }
    console.log(text, txUrl);
    const castHash = await publishCast(`${text}\n\n${txUrl}`);
    console.log(`Successfully published cast ${castHash}`);
  } catch (e) {
    // if we're here, no farcaster identity has been found
    if (wethIndex > pointsIndex) {
      console.log(
        `${from} swapped ${wrappedEthData.amount} $WETH for ${pointsData.amount} $POINTS`, txUrl
      );
    } else {
      console.log(
        `${from} swapped ${pointsData.amount} $POINTS for ${wrappedEthData.amount} $WETH`, txUrl
      );
    }
  }

  /**
   * Do things here with the received data
   * e.g., save to database, send to analytics, etc.
   */

  res.json({message: "Successfully processed webhook event"});
}
