import {SignedTransaction} from "web3-eth-accounts";
import Web3 from "web3";
import {TransactionReceipt} from "web3-eth";
import {tokenContractAbi} from "./abi";
import {constants} from "../../constants";

export const web3 = new Web3(constants.POLYGON_MUMBAI_RPC);

export const sendSignedTransaction = async (
  signedTransactionData: string
): Promise<TransactionReceipt> => {
  return web3.eth.sendSignedTransaction(signedTransactionData);
};

export const getTransferSignedTransaction = async (
  transferToAddress: string,
  transferAmount: number
): Promise<SignedTransaction> => {
  // get contract
  const contract = new web3.eth.Contract(
    tokenContractAbi as any,
    constants.TOKEN_SMART_CONTRACT.ADDRESS
  );
  // get account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY
  );

  const encodedABI = contract.methods["transfer"](
    transferToAddress,
    transferAmount
  ).encodeABI();

  const gasPrice = await web3.eth.getGasPrice();

  const gasEstimate = await contract.methods["transfer"](
    transferToAddress,
    transferAmount
  ).estimateGas({
    from: account.address,
  });
  return await account.signTransaction({
    to: constants.TOKEN_SMART_CONTRACT.ADDRESS,
    gas: gasEstimate,
    gasPrice: gasPrice,
    data: encodedABI,
  });
};
