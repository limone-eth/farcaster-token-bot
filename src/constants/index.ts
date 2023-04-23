import "dotenv/config";

export const constants = {
  TOKEN_SMART_CONTRACT: {
    ADDRESS: "0xd554fcd8a335a3c487618aa0402b6da4e828cd2a",
    TRANSFER_EVENT_TOPIC:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  },
  POLYGON_MUMBAI_RPC: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
};
