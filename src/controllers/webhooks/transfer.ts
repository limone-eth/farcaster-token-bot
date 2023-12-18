import {Request, Response} from "express";
import {AlchemyWebhookEvent} from "../../utils/alchemy";
import {constants} from "../../constants";
import {formatAddress, formatBigNumber, getTransactionUrl} from "../../utils";
import {providers} from "ethers";
import {decodeTransferEvent} from "../../utils/smart-contracts/decode-events";
import {getFarcasterIdentity} from "../../utils/web3-bio";
import {publishCast} from "../../utils/farcaster";

// TODO: introduce support for transfer events
export async function processTransferEvent(
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

  if (!logsData) {
    console.log(
      `No Swap Event found in webhook event at ${new Date().toISOString()}`
    );
    res.json({message: "No Swap Event found in webhook event"});
    return;
  }

  const txUrl = getTransactionUrl(logsData.transaction.hash);

  // get transaction receipt to extract the sender
  const provider = new providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
  const txReceipt = await provider.getTransactionReceipt(
    logsData.transaction.hash
  );

  const txLogs = txReceipt.logs;

  if (
    txLogs.length === 1 &&
    txLogs.find((l) => l.topics[0] === constants.TRANSFER_EVENT_TOPIC)
  ) {
    const {from, to, value} = decodeTransferEvent(
      logsData.topics,
      logsData.data
    );

    const farcasterFromIdentity = await getFarcasterIdentity(from);
    const farcasterToIdentity = await getFarcasterIdentity(to);
    const fromText = farcasterFromIdentity
      ? `@${farcasterFromIdentity}`
      : formatAddress(from);
    const toText = farcasterToIdentity
      ? `@${farcasterToIdentity}`
      : formatAddress(to);

    const text = `${fromText} transferred ${formatBigNumber(
      value,
      parseInt(process.env.TOKEN_DECIMALS)
    )} $${constants.TOKEN_SYMBOL} to ${toText}`;

    console.log(text, txUrl);
    const castHash = await publishCast(`${text}\n\n${txUrl}`);
    console.log(`Successfully published cast ${castHash}`);
  }
}
