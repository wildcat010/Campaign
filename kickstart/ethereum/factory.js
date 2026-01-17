import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x619bbfa90b7D880C4197574ff45Af1b5bdAf4B9b"
);

export default instance;
