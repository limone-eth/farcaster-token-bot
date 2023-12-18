const BASE_URL = "https://open-api.dextools.io/free/v2";

export interface TokenInfo {
  totalSupply: number;
  mcap: number;
  fdv: number;
  holders: number;
  transactions: number;
}

export const getTokenInfo = async (
  tokenAddress: string,
  chain = "ether"
): Promise<TokenInfo> => {
  const url = `${BASE_URL}/token/${chain}/${tokenAddress}/info`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-BLOBR-KEY": process.env.DEXTOOLS_API_KEY,
    },
  });
  const {data} = await response.json();
  return data;
};

export interface TokenPriceInfo {
  price: number;
  priceChain: number;
  price5m: number;
  priceChain5m: number;
  variation5m: number;
  price1h: number;
  priceChain1h: number;
  variation1h: number;
  price6h: number;
  priceChain6h: number;
  variation6h: number;
  price24h: number;
  priceChain24h: number;
  variation24h: number;
}

export const getTokenPriceInfo = async (
  tokenAddress: string,
  chain = "ether"
): Promise<TokenPriceInfo> => {
  const url = `${BASE_URL}/token/${chain}/${tokenAddress}/price`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-BLOBR-KEY": process.env.DEXTOOLS_API_KEY,
    },
  });
  const {data} = await response.json();
  return data;
};

interface PoolPriceInfo {
  price: number;
  priceChain: number;
  price5m: number;
  priceChain5m: number;
  volume5m: number;
  sells5m: number;
  buys5m: number;
  sellVolume5m: number;
  buyVolume5m: number;
  variation5m: number;
  variationChain5m: number;
  price1h: number;
  priceChain1h: number;
  volume1h: number;
  sells1h: number;
  buys1h: number;
  sellVolume1h: number;
  buyVolume1h: number;
  variation1h: number;
  variationChain1h: number;
  price6h: number;
  priceChain6h: number;
  volume6h: number;
  sells6h: number;
  buys6h: number;
  sellVolume6h: number;
  buyVolume6h: number;
  variation6h: number;
  variationChain6h: number;
  price24h: number;
  priceChain24h: number;
  volume24h: number;
  sells24h: number;
  buys24h: number;
  sellVolume24h: number;
  buyVolume24h: number;
  variation24h: number;
  variationChain24h: number;
}

export const getPoolPriceInfo = async (
  poolAddress: string,
  chain = "ether"
): Promise<PoolPriceInfo> => {
  const url = `${BASE_URL}/pool/${chain}/${poolAddress}/price`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-BLOBR-KEY": process.env.DEXTOOLS_API_KEY,
    },
  });
  const {data} = await response.json();
  return data;
};
