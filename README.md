# node-web3-js

## Setup

1. Populate _.env_ file:
    1. `WALLET_PRIVATE_KEY` - [How to export a Metamask account's private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)
    2. `ALCHEMY_API_KEY` - [Alchemy API Key](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key)
    3. `ALCHEMY_WEBHOOK_SIGNING_KEY` - [Alchemy Custom Webhooks](https://docs.alchemy.com/reference/custom-webhook#how-to-set-up-custom-webhooks)
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

You can use [Ngrok](https://ngrok.com/) to expose your local environment to the internet. Open a terminal window and type `ngrok http 3000`
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