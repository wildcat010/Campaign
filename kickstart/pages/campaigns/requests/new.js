import React, { useState, useEffect } from "react";
import Layout from "./../../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import campaign from "./../../../ethereum/campaign";
import web3 from "./../../../ethereum/web3";
import { useRouter } from "next/router";
import "semantic-ui-css/semantic.min.css";
import { Router } from "./../../../routes";

const RequestNew = () => {

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [addressRecipient, setAddressRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
const { address } = router.query;

  if (!router.isReady) {
    return null; // prevent undefined address usage
  }

  const toBytes32 = (text) => {
  return web3.utils.padRight(web3.utils.utf8ToHex(text), 64);
}

const bytes32ToString = (bytes32Str) => {
  return web3.utils.hexToUtf8(bytes32Str).replace(/\0+$/, "");
}

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
        console.log("on submit")

      const accounts = await web3.eth.getAccounts();
      console.log("account")
      const campaignInstance = campaign(address);
      console.log("campaign instance")

      console.log("created")

      await campaignInstance.methods
        .createRequest(
          toBytes32(description),
          web3.utils.toWei(value, "wei"),
          addressRecipient
        )
        .send({
          from: accounts[0],
        });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a new Request</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description of the request</label>
          <Input
            placeholder="Description"
            icon="address card"
            iconPosition="left"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value</label>
          <Input
            placeholder="Value"
            icon="ethereum"
            iconPosition="left"
            type="number"
            label={{ basic: true, content: "WEI" }}
            labelPosition="right"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Address Recipient</label>
          <Input
            placeholder="Address"
            icon="ethereum"
            iconPosition="left"
            label={{ basic: true, content: "@" }}
            labelPosition="right"
            value={addressRecipient}
            onChange={(e) => setAddressRecipient(e.target.value)}
          />
        </Form.Field>

        <Message error header="Error" content={errorMessage} />

        <Button primary loading={loading} disabled={loading}>
          Create Request
        </Button>
      </Form>
    </Layout>
  );
};

export default RequestNew;
