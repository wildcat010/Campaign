import React from "react";
import { Table, MenuMenu, MenuItem, Menu, Button } from "semantic-ui-react";

import { Link } from "./../routes";
import web3 from "./../ethereum/web3";

const RequestRow = (props) => {
  const campaignContract = props.campaign;
  console.log(props);

  const bytes32ToString = (bytes32Str) => {
    return web3.utils.toAscii(bytes32Str).replace(/\0/g, "");
  };

  const onApprove = async () => {
    const accounts = await web3.eth.getAccounts();
    campaignContract.methods.approveRequest(props.id).send({
      from: accounts[0],
    });
  };

  const onFinalize = async () => {};

  const { Row, Cell } = Table;

  return (
    <Row>
      <Cell>{props.id + 1}</Cell>
      <Cell>{bytes32ToString(props.request.description)}</Cell>
      <Cell>{props.request.value.toString()}</Cell>
      <Cell>{props.request.recipient}</Cell>
      <Cell>{`${props.request.approvalCount.toString()} / ${props.request.approversCount.toString()}`}</Cell>
      <Cell>
        <Button color="green" basic onCLick={onApprove}></Button>
      </Cell>
      <Cell>
        {" "}
        <Button color="green" basic onCLick={onFinalize}></Button>
      </Cell>
    </Row>
  );
};
export default RequestRow;
