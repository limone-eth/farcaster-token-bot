# farcaster token bot

clone this repository to easily spin-up a farcaster bot that tracks a token.

currently supports erc20, some tweaks are needed to track erc721 and erc1155.

## before starting

this repository was started for [pointsbot](https://warpcast.com/pointsbot), meaning that i tried to generalize it as much as possible, but you'll need to adapt the code a lil bit for whatever token you wanna track.

### what it does right now

- catch "swap" events on a given uniswap pool and publishes it on farcaster ([example cast](https://warpcast.com/pointsbot/0x9dfb424a)) - by default the swap events tracked are between your token and $weth, but easy to replace $weth with something else
- catch direct "transfer" events between two addresses and publishes it on farcaster - publish only if one of the two addresses involved own a farcaster account
- publishes on farcaster hourly updates about token stats (market cap, volumes 24h, holders) ([example cast](https://warpcast.com/pointsbot/0xf29574d5))
- publishes updates every 2 hour about the top holders on farcaster ([example cast](https://warpcast.com/pointsbot/0xc77fe4c1))

## how to make it work

1. install packages with `bun install` (if u don't use `bun`, u can still use `npm` or `yarn`)
2. setup local env with `cp .env.tpl .env` and then populate your `.env`
3. update **__src/constants/index.ts__** accordingly with your token details (address, symbol and decimals) - you can find those on https://etherscan.io/token/YOUR_TOKEN_ADDRESS
4. deploy it somewhere - i used [railway](https://railway.app/) and created a simple service connected to my github repository, so that at each push it triggers a new deployment.

### about api keys

- go [here](https://app.airstack.xyz/profile-settings/api-keys) to get airstack api key - airstack is used to get the leaderboard of holders on farcaster
- go [here](https://developer.dextools.io/) to get dextools api key - dextools is used to get token stats
- go [here](https://mfsa.cc/) to get a farcaster signer uuid and api key - ofc used to publish casts on farcaster, you'll likely need to create a new account for your bot
- go [here](https://dashboard.alchemy.com/apps) to get alchemy rpc url
- go [here](https://dashboard.alchemy.com/webhooks) to setup your webhook - check this [gist](https://gist.github.com/limone-eth/15fa907a02e2c1f1158b9cbdbac3c15c) to understand how to structure the graphql query in order to filter the right events sent through your webhook

## what next?

- add support erc721 and/or erc1155
