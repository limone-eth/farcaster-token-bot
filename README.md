# node-web3-js

## Setup

1. Populate _.env_ file:
    1. `WALLET_PRIVATE_KEY`
        - [How to export a Metamask account's private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)
    2. `ALCHEMY_API_KEY`
        - [Alchemy API Key](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key)
    3. `ALCHEMY_WEBHOOK_SIGNING_KEY`
        - [Alchemy Custom Webhooks](https://docs.alchemy.com/reference/custom-webhook#how-to-set-up-custom-webhooks)
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the project and compile Typescript in Javascript
4. Run `npm run start` to start the Express server and listen to API calls

## Creating an Alchemy Webhook

You can follow
the [docs by Alchemy on Custom Webhooks](https://docs.alchemy.com/reference/custom-webhook#how-to-set-up-custom-webhooks)
.

On Alchemy when creating a Webhook you'll be asked to write a GraphQL query to filter the contract addresses and the
events you are interested it.

Make sure your Webhook is pointing to the right network. In the default case, it should be pointing to the Polygon
Mumbai network.

### How can I test this locally?

You can use [Ngrok](https://ngrok.com/) to expose your local environment to the internet. Open a terminal window and
type `ngrok http 3000`
and you will get a URL that you can use to test your webhook.

Example URL by Ngrok: https://bc9d-2a01-11-9210-5a40-5c18-d3b5-7dcd-b34e.ngrok-free.app

So on Alchemy you can put https://bc9d-2a01-11-9210-5a40-5c18-d3b5-7dcd-b34e.ngrok-free.app/webhooks/events

## Test the project

Once everything is set up, you can test the project by sending a POST request to the following endpoint:

- **POST** http://localhost:3000/tokens/send
    ```json
    {
      "address": "0x8E8C44C72cee669EBcb0933360F194C9b7cC8BEd",
      "amount": 10
    }
    ```

## Step-by-step guide

Follow this guide to recreate the repo step-by-step.

1. Assuming you are in a new (and clean) folder, the first thing to do is **initializing a new npm project**. You can do
   that using
   the CLI `npm init -y`. This command will create a _package.json_ file with a simple setup and configuration that you
   will be
   able to edit later.
2. Before starting to code, let's first **install all the packages that we will need along our
   journey**: `npm install --save express ethers web3 web3-eth web3-eth-accounts bignumber.js dotenv`
    1. _express_: to easily setup a REST API
    2. _ethers, web3, web3-eth, web3-eth-accounts_: needed for our web3 shenanigans (interacting with the blockchain)
    3. _bignumber.js_: the blockchain uses this format to represent numbers, so we need it to properly decode some data
3. **Let's start with our Express app!** Create an _index.ts_ file inside the _src_ folder and set up a simple Express
   with one endpoint _POST /tokens/send_. We also need to create a controller for this endpoint, so let's create a
   _controllers_ folder with a _tokens.ts_ file in it. In _tokens.ts_ we will write some code that allows transferring
   an _amount_ of tokens from the owner address to another address. Try it out on Postman and check Polygon scan if the
   transaction went well.
4. Next in line, we want to be able to **listen to our Token smart contract events**. Meaning that everytime somebody
   transfers tokens to another address, we want to be notified about: who transferred the tokens to whom, together with
   the amount transferred. To do that we can integrate with the newly released Alchemy Custom Webhooks. We will create a
   new endpoint in our express app: _POST /webhooks/events_, and a new controller that processes the event and logs the
   data in which we are interested.
5. To complete our exercise, let's try the whole flow again. Trigger an HTTP call to send some tokens, and let's see if
   our webhook endpoint is received and decoding the event data properly.