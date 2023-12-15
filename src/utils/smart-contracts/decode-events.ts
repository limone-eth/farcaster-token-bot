import {ethers} from "ethers";
import {pointsAbi} from "./points-abi";

export const decodeTransferEvent = (
  topics: Array<string>,
  data: string,
): {to: string; amount: number; from: string} => {
  const iface = new ethers.utils.Interface(pointsAbi);
  const event = iface.parseLog({
    data,
    topics,
  });
  const {from, to, value} = event.args;
  return {
    to, // the address that received the tokens
    from, // the address that sent the tokens
    amount: value / 10 ** 18, // the amount of tokens received
  };
};
