import {NeynarAPIClient} from "@standard-crypto/farcaster-js-neynar";

export const publishCast = async (text: string) => {
  if (!process.env.ENABLE_FARCASTER) {
    return "0x";
  }
  if (!process.env.FARCASTER_API_KEY || !process.env.FARCASTER_SIGNER_UUID) {
    throw new Error(
      "FARCASTER_API_KEY and FARCASTER_SIGNER_UUID must be set in the environment"
    );
  }
  const signerUuid = process.env.FARCASTER_SIGNER_UUID as string;
  const client = new NeynarAPIClient(process.env.FARCASTER_API_KEY as string);
  const publishedCast = await client.v2.publishCast(signerUuid, text);

  console.log(`New cast hash: ${publishedCast.hash}`);

  return publishedCast.hash;
};

export const replyToCast = async (existingCastHash: string, reply: string) => {
  if (!process.env.ENABLE_FARCASTER) {
    return "0x";
  }
  if (!process.env.FARCASTER_API_KEY || !process.env.FARCASTER_SIGNER_UUID) {
    throw new Error(
      "FARCASTER_API_KEY and FARCASTER_SIGNER_UUID must be set in the environment"
    );
  }
  const signerUuid = process.env.FARCASTER_SIGNER_UUID as string;
  const client = new NeynarAPIClient(process.env.FARCASTER_API_KEY as string);

  const publishedCast = await client.v2.publishCast(signerUuid, reply, {
    replyTo: existingCastHash,
  });

  console.log(`Reply hash:${publishedCast.hash}`);

  return publishedCast.hash;
};
