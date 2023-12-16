import {gql} from "@apollo/client/core";

import {fetchAllPagesQuery} from "../index";
import {ethers} from "ethers";
import {constants} from "../../../constants";
import {getTokenPriceInfo} from "../../dextools";
import {publishCast, replyToCast} from "../../farcaster";

export const TokenBalancesQuery = gql`
  query MyQuery($address: Address!) {
    TokenBalances(
      input: {
        filter: {tokenAddress: {_eq: $address}}
        blockchain: ethereum
        limit: 200
        order: {}
      }
    ) {
      TokenBalance {
        amount
        owner {
          socials(input: {filter: {dappName: {_eq: farcaster}}}) {
            profileName
            profileTokenId
            profileTokenIdHex
            userAssociatedAddresses
          }
        }
      }
    }
  }
`;

interface TokenBalancesQueryResponse {
  TokenBalances: {
    TokenBalance: {
      amount: number;
      owner: {
        socials: {
          profileName: string;
          profileTokenId: string;
          profileTokenIdHex: string;
          userAssociatedAddresses: string[];
        }[];
      };
    }[];
  };
}

export const fetchTokenBalancesProfiles = async (tokenAddress: string) => {
  const tokenBalancesResponse =
    await fetchAllPagesQuery<TokenBalancesQueryResponse>(TokenBalancesQuery, {
      address: tokenAddress,
    });

  return tokenBalancesResponse
    .flatMap((page) =>
      page?.TokenBalances.TokenBalance.map((tokenBalance) => {
        if (
          !tokenBalance.owner.socials ||
          !tokenBalance.owner.socials[0].profileName
        )
          return null;
        return {
          amount: tokenBalance.amount,
          formattedAmount: ethers.utils
            .formatUnits(tokenBalance.amount, 18)
            .replace(/(\.\d{0,4})\d*$/, "$1"),
          profileName: tokenBalance.owner.socials[0].profileName,
        };
      })
    )
    .filter(Boolean)
    .sort((a, b) => b.amount - a.amount);
};

export const publishFarcasterLeaderboard = async (topK = 10) => {
  const tokenPriceInfo = await getTokenPriceInfo(
    constants.TOKEN_SMART_CONTRACT_ADDRESS
  );
  const tokenBalancesProfiles = await fetchTokenBalancesProfiles(
    constants.TOKEN_SMART_CONTRACT_ADDRESS
  );

  const leaderboard = tokenBalancesProfiles
    .slice(0, topK)
    .map((profile, index) => ({
      name: profile.profileName,
      amount: profile.formattedAmount,
      index: index + 1,
    }));

  const text1 = `top 10 $points 🐳 on farcaster\n\n🥇 @${
    leaderboard[0].name
  }: ${leaderboard[0].amount} ($${convertPointsAmountToUSD(
    leaderboard[0].amount,
    tokenPriceInfo.price
  )})\n\n🥈 @${leaderboard[1].name}: ${
    leaderboard[1].amount
  } ($${convertPointsAmountToUSD(
    leaderboard[1].amount,
    tokenPriceInfo.price
  )})\n\n🥉 @${leaderboard[2].name}: ${
    leaderboard[2].amount
  } ($${convertPointsAmountToUSD(
    leaderboard[2].amount,
    tokenPriceInfo.price
  )})\n\ncontinues...👇`;
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

export const convertPointsAmountToUSD = (
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
        } ($${convertPointsAmountToUSD(profile.amount, tokenPrice)})`
    )
    .join("\n\n");
};
