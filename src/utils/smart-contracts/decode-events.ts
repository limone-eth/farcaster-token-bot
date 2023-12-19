import {BigNumber, ethers} from "ethers";
import {erc20Abi} from "./erc20-abi";
import {poolAbi} from "./pool-abi";

export const decodeTransferEvent = (
  topics: Array<string>,
  data: string
): {to: string; value: BigNumber; from: string} => {
  const iface = new ethers.utils.Interface(erc20Abi);
  const event = iface.parseLog({
    data,
    topics,
  });
  const {from, to, value} = event.args;
  return {
    to, // the address that received the tokens
    from, // the address that sent the tokens
    value, // the amount of tokens received
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
