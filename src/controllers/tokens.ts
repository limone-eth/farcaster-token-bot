import {Request, Response} from "express";
import {
  getTransferSignedTransaction,
  sendSignedTransaction,
} from "../utils/smart-contracts/web3";

export async function sendTokens(req: Request, res: Response): Promise<void> {
  const {address, amount} = req.body;
  const signedTx = await getTransferSignedTransaction(address, amount);
  try {
    // get the transaction hash
    const tx = await sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Sending ${amount} tokens to ${address}`, {
      txHash: tx.transactionHash,
      params: {address, amount},
    });
    res.status(200).json({message: "OK"});
  } catch (e) {
    console.log(`Error while sending tokens to ${address}`, {
      params: {address, amount},
    });
    res.status(400).json({message: `Error while sending tokens to ${address}`});
  }
}
