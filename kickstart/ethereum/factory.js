import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x1D857C08cdf08ccd632c6642d6B1aCdfe71c4D6b"
);

export default instance;
