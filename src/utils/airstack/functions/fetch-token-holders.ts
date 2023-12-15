import {gql} from "@apollo/client/core";

import {fetchAllPagesQuery} from "../index";
import {BigNumber, ethers} from "ethers";
import {constants} from "../../../constants";
import {publishCast} from "../../farcaster";

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
        if (!tokenBalance.owner.socials) return null;
        console.log(ethers.utils.formatUnits(tokenBalance.amount, 18));
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

export const publishFarcasterLeaderboard = async (topK = 5) => {
  const tokenBalancesProfiles = await fetchTokenBalancesProfiles(
    constants.POINTS_SMART_CONTRACT_ADDRESS
  );

  const leaderboard = tokenBalancesProfiles.slice(0, topK).map((profile) => ({
    name: profile.profileName,
    amount: profile.formattedAmount,
  }));

  const text = `$points 🐳 on farcaster\n\n🥇 @${leaderboard[0].name}: ${leaderboard[0].amount}\n\n🥈 @${leaderboard[1].name}: ${leaderboard[1].amount}\n\n🥉 @${leaderboard[2].name}: ${leaderboard[2].amount}`;

  await publishCast(text);
};
