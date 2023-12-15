export interface UserProfile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string;
  email: string | null;
  description: string;
  location: string;
  header: string | null;
  links: {
    farcaster: {
      link: string;
      handle: string;
    };
  };
}

export const getFarcasterIdentity = async (address: string): Promise<string> => {
  const data = await fetch(`https://api.web3.bio/profile/farcaster/${address}`);
  const result = await data.json();
  if (!result.identity) {
    throw new Error("No identity found");
  }
  return result.identity;
};
