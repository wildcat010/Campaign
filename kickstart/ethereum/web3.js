import Web3 from "web3";

import HDWalletProvider from "@truffle/hdwallet-provider";

let web3;

// We are on the server *OR* the user is not running metamask
const provider = new HDWalletProvider({
  privateKeys: [
    "5688e9741acf81487d7ce7c3bca4d2df243ec9ca81c8ed3e09d7b04c2a484796",
  ],
  providerOrUrl:
    "https://sepolia.infura.io/v3/13d42e71f5b149109e3abf6e83cb93e4",
});
web3 = new Web3(provider);

export default web3;
