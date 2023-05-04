import {ThirdwebSDK} from "@thirdweb-dev/sdk";
import {Request, Response} from "express";
import {constants} from "../constants";
import {tokenContractAbi} from "../utils/smart-contracts/abi";

export async function sendTokens(req: Request, res: Response): Promise<void> {
  const {address, amount} = req.body;
  const thirdwebSDK = ThirdwebSDK.fromPrivateKey(
    process.env.WALLET_PRIVATE_KEY,
    constants.POLYGON_MUMBAI_RPC
  );
  try {
    // get the transaction hash
    const contract = await thirdwebSDK.getContractFromAbi(
      constants.TOKEN_SMART_CONTRACT.ADDRESS,
      tokenContractAbi
    );
    const data = await contract.call("transfer", [address, amount]);
    console.log(`Sending ${amount} tokens to ${address}`, {
      data,
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
