import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import {tokenContractAbi} from "./abi";

export const decodeTransferEvent = (
  topics: Array<string>,
  data: string
): {to: string; amount: number; from: string} => {
  const iface = new ethers.Interface(tokenContractAbi);
  const event = iface.parseLog({
    data,
    topics,
  });
  const [from, to, amount] = event.args;
  return {
    to, // the address that received the tokens
    from, // the address that sent the tokens
    amount: BigNumber(amount).toNumber(), // the amount of tokens received
  };
};
