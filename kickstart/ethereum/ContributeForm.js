import web3 from "./web3";
import { useEffect, useState } from "react";
import Campaign from "./campaign";
import { FormField, Button, Checkbox, Form } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { MessageHeader, Message } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS

import { Router } from "./../routes";

const ContributeForm = (props) => {
  const { minimumContribution, address, onContributionSuccess } = props;

  const [contribution, setContribution] = useState(props.minimumContribution);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    setErrorMessage("");

    try {
      const campaignContract = Campaign(address);

      const accounts = await web3.eth.getAccounts();

      await campaignContract.methods
        .contribute()
        .send({ value: contribution, from: accounts[0] });

      if (onContributionSuccess) {
        await onContributionSuccess();
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit} error={error}>
        <FormField error={error}>
          <label>Contribution value: {contribution}</label>
          <Input
            placeholder="Contribution value"
            icon="ethereum"
            iconPosition="left"
            type="number"
            label={{ basic: true, content: "WEI" }}
            labelPosition="right"
            onChange={(event) => setContribution(event.target.value)}
          />
        </FormField>

        <Message error>
          <MessageHeader>Error</MessageHeader>
          <p>{errorMessage}</p>
        </Message>

        <Button type="submit" primary loading={loading} disabled={loading}>
          Contribute
        </Button>
      </Form>
    </div>
  );
};

export default ContributeForm;
