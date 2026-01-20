import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { FormField, Button, Checkbox, Form, Input } from "semantic-ui-react";
import factory from "./../../ethereum/factory";
import web3 from "./../../ethereum/web3";
import { MessageHeader, Message } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS

import { Router } from "./../../routes";
import { getAccounts } from "./../../ethereum/accounts";

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState(100);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    setErrorMessage("");

    try {
      const value = parseInt(minimumContribution);
      if (isNaN(value) || value <= 0) {
        throw new Error("Minimum contribution must be greater than zero");
      }

      const accounts = await getAccounts();

      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0], gas: 1000000 });

      Router.pushRoute("/");
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a new Campaign</h3>
      <Form onSubmit={onSubmit} error={error}>
        <FormField error={error}>
          <label>Minimum Contribution value: {minimumContribution}</label>
          <Input
            placeholder="Minimum Contribution value"
            defaultValue={minimumContribution}
            icon="ethereum"
            iconPosition="left"
            type="number"
            label={{ basic: true, content: "WEI" }}
            labelPosition="right"
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </FormField>

        <Message error>
          <MessageHeader>Error</MessageHeader>
          <p>{errorMessage}</p>
        </Message>

        <Button type="submit" primary loading={loading} disabled={loading}>
          Create Campaign
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
