import web3 from "./web3";

import Campaign from "./build/Campaign.json";
import { FormField, Button, Checkbox, Form } from "semantic-ui-react";

export default (address) => {
  return new web3.eth.Contract(Campaign.abi, address);
};
