import {gql} from "@apollo/client/core";

import {fetchAllPagesQuery} from "../index";
import {ethers} from "ethers";

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


