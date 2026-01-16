import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x6652901cE2F247ED3c2112Be16469a4Dd3Cd9356"
);

export default instance;
