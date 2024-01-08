import "dotenv/config";

export const constants = {
  TRANSFER_EVENT_TOPIC:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  POOL_SWAP_EVENT_TOPIC:
    "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
  WRAPPED_ETH_SMART_CONTRACT_ADDRESS:
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  // the address of the token you want to track
  TOKEN_ADDRESS: "0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f",
  // the decimals of the token you want to track
  TOKEN_DECIMALS: 18,
  // the symbol of the token you want to track
  TOKEN_SYMBOL: process.env.TOKEN_SYMBOL || "POINTS",
  // the address of the Uniswap V3 Pool you want to track (for swaps)
  TOKEN_UNISWAP_POOL_ADDRESS: "0xa424817985051ccda51eff2dc7998b5d68079215",
};
