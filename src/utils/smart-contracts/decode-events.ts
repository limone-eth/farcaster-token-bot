import {BigNumber, ethers} from "ethers";
import {pointsAbi} from "./points-abi";
import {poolAbi} from "./pool-abi";

export const decodeTransferEvent = (
  topics: Array<string>,
  data: string
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

export const decodeSwapEvent = (
  topics: Array<string>,
  data: string
): {amountIn: BigNumber; amountOut: BigNumber} => {
  const iface = new ethers.utils.Interface(poolAbi);
  const event = iface.parseLog({
    data,
    topics,
  });
  const {amount0, amount1} = event.args;
  const amountIn = amount0 > 0 ? amount0 : amount1;
  const amountOut = amount0 > 0 ? amount1 : amount0;
  return {
    amountIn: amountIn,
    amountOut: amountOut.abs(),
  };
};
