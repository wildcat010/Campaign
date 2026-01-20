import React, { useEffect, useState } from "react";
import { Table, MenuMenu, MenuItem, Menu, Button } from "semantic-ui-react";

import { Link } from "./../routes";
import web3 from "./../ethereum/web3";
import { getAccounts } from "./../ethereum/accounts";

const RequestRow = (props) => {
  const campaignContract = props.campaign;
  const [approvers, setApprovers] = useState(null); // <-- state for approvers

  console.log("props", props);

  useEffect(() => {
    const fetchApprovers = async () => {
      const approversCount = await campaignContract.methods
        .approversCount()
        .call();
      setApprovers(approversCount);
    };

    fetchApprovers();
  }, []);

  const bytes32ToString = (bytes32Str) => {
    return web3.utils.toAscii(bytes32Str).replace(/\0/g, "");
  };

  const onApprove = async () => {
    const accounts = await getAccounts();
    await campaignContract.methods.approveRequest(props.id).send({
      from: accounts[0],
    });
  };

  const onFinalize = async () => {
    const accounts = await getAccounts();
    await campaignContract.methods.finalizeRequest(props.id).send({
      from: accounts[0],
    });
  };

  const { Row, Cell } = Table;
  const readyToFinalize =
    props.request.approvalCount > props.request.approversCount / 2;

  return (
    <Row
      disabled={props.request.complete}
      positive={readyToFinalize && !props.request.complete}
    >
      <Cell>{props.id + 1}</Cell>
      <Cell>{bytes32ToString(props.request.description)}</Cell>
      <Cell>{props.request.value.toString()}</Cell>
      <Cell>{props.request.recipient}</Cell>
      <Cell>{`${props.request.approvalCount.toString()} / ${approvers?.toString()}`}</Cell>
      <Cell>
        {props.request.complete ? null : (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {" "}
        {props.request.complete ? null : (
          <Button color="teal" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};
export default RequestRow;
