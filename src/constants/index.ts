import "dotenv/config";

export const constants = {
  TRANSFER_EVENT_TOPIC:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  WRAPPED_ETH_SMART_CONTRACT_ADDRESS:
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  POINTS_SMART_CONTRACT_ADDRESS: "0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f",
  POLYGON_MUMBAI_RPC: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
};
