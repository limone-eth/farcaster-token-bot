import {Request, Response} from "express";
import {AlchemyWebhookEvent} from "../utils/alchemy";
import {constants} from "../constants";
import {decodeSwapEvent} from "../utils/smart-contracts/decode-events";
import {getFarcasterIdentity} from "../utils/web3-bio";
import {ethers, providers} from "ethers";
import {publishCast} from "../utils/farcaster";

export async function processPoolSwapEvent(
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
  } = logs.find((l) => l.topics[0] === constants.POOL_SWAP_EVENT_TOPIC);

  let txUrl: string;
  try {
    txUrl = `https://zapper.xyz/event/ethereum/${logsData.transaction.hash}`;
  } catch (e) {
    console.error(e);
    res.json({message: "Error processing webhook event"});
    return;
  }

  const provider = new providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
  const txReceipt = await provider.getTransactionReceipt(
    logsData.transaction.hash
  );

  const {from} = txReceipt;

  const {amountIn, amountOut} = decodeSwapEvent(logsData.topics, logsData.data);

  const pointsAmount = amountIn.gte(amountOut) ? amountIn : amountOut;
  const wethAmount = amountIn.gte(amountOut) ? amountOut : amountIn;

  const formattedPointsAmount = ethers.utils
    .formatUnits(pointsAmount, 18)
    .replace(/(\.\d{0,4})\d*$/, "$1");
  const formattedWethAmount = ethers.utils
    .formatUnits(wethAmount, 18)
    .replace(/(\.\d{0,4})\d*$/, "$1");

  try {
    const farcasterIdentity = await getFarcasterIdentity(from);
    const text = `@${farcasterIdentity} swapped ${
      amountIn === pointsAmount
        ? `${formattedPointsAmount} $POINTS`
        : `${formattedWethAmount} $WETH`
    } for ${
      amountOut === pointsAmount
        ? `${formattedPointsAmount} $POINTS`
        : `${formattedWethAmount} $WETH`
    }`;

    console.log(text, txUrl);
    const castHash = await publishCast(`${text}\n\n${txUrl}`);
    console.log(`Successfully published cast ${castHash}`);
  } catch (e) {}

  /**
   * Do things here with the received data
   * e.g., save to database, send to analytics, etc.
   */

  res.json({message: "Successfully processed webhook event"});
}

/*
TODO: introduce support for transfer events
export async function processTransferEvent(
  req: Request,
  res: Response
): Promise<void> {
  <code_here>
}
*/
