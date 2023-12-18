import {constants} from "../constants";
import {fetchTokenBalancesProfiles} from "../utils/airstack/functions/fetch-token-holders";
import {getTokenPriceInfo} from "../utils/dextools";
import {publishCast, replyToCast} from "../utils/farcaster";

export const publishFarcasterLeaderboard = async (topK = 10) => {
  const tokenPriceInfo = await getTokenPriceInfo(constants.TOKEN_ADDRESS);
  const tokenBalancesProfiles = await fetchTokenBalancesProfiles(
    constants.TOKEN_ADDRESS
  );

  const leaderboard = tokenBalancesProfiles
    .slice(0, topK)
    .map((profile, index) => ({
      name: profile.profileName,
      amount: profile.formattedAmount,
      dollarsAmount: convertTokensAmountToUSD(
        profile.formattedAmount,
        tokenPriceInfo.price
      ),
      index: index + 1,
    }));

  const text1 = `top 10 $points 🐳 on farcaster\n\n🥇 @${leaderboard[0].name}: ${leaderboard[0].amount} ($${leaderboard[0].dollarsAmount})\n\n🥈 @${leaderboard[1].name}: ${leaderboard[1].amount} ($${leaderboard[1].dollarsAmount})\n\n🥉 @${leaderboard[2].name}: ${leaderboard[2].amount} ($${leaderboard[2].dollarsAmount})\n\ncontinues...👇`;

  const text2 = getTextForLeaderboard(
    leaderboard.slice(3, 6),
    tokenPriceInfo.price
  );

  const text3 = getTextForLeaderboard(
    leaderboard.slice(6, 10),
    tokenPriceInfo.price
  );

  const parentCast = await publishCast(text1);
  const replyCast1 = await replyToCast(
    parentCast,
    `${text2}\n\ncontinues...👇`
  );
  await replyToCast(replyCast1, text3);
};

export const convertTokensAmountToUSD = (
  amount: string,
  pointsPrice: number
) => {
  return (parseFloat(amount) * pointsPrice).toFixed(2);
};

export const getTextForLeaderboard = (
  profiles: {
    name: string;
    amount: string;
    index: number;
  }[],
  tokenPrice: number
): string => {
  return profiles
    .map(
      (profile) =>
        `${profile.index}. @${profile.name}: ${
          profile.amount
        } ($${convertTokensAmountToUSD(profile.amount, tokenPrice)})`
    )
    .join("\n\n");
};
