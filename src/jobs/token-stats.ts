import {constants} from "../constants";
import {
  getPoolPriceInfo,
  getTokenInfo,
  getTokenPriceInfo,
} from "../utils/dextools";
import {publishCast} from "../utils/farcaster";

export const publishTokenStats = async (): Promise<void> => {
  const tokenInfo = await getTokenInfo(constants.TOKEN_ADDRESS);
  const tokenPriceInfo = await getTokenPriceInfo(constants.TOKEN_ADDRESS);
  const poolPriceInfo = await getPoolPriceInfo(
    constants.TOKEN_UNISWAP_POOL_ADDRESS
  );

  const text = `📈 $points stats: \n\n- market cap -> $${(
    tokenPriceInfo.price * tokenInfo.totalSupply
  ).toLocaleString()}\n\n- volume (last 24h) -> $${poolPriceInfo.volume24h.toLocaleString()}\n\n- holders -> ${
    tokenInfo.holders
  }\n\n`;

  await publishCast(text);
};
