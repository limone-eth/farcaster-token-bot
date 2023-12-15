import "dotenv/config";

export const constants = {
  TRANSFER_EVENT_TOPIC:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  SWAP_EVENT_TOPIC:
    "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
  POOL_SWAP_EVENT_TOPIC:
    "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
  WRAPPED_ETH_SMART_CONTRACT_ADDRESS:
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  POINTS_SMART_CONTRACT_ADDRESS: "0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f",
  POLYGON_MUMBAI_RPC: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
};
