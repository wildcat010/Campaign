import React, { useEffect, useState } from "react";
import instance from "../ethereum/factory";
import { Card, Button, Icon } from "semantic-ui-react";
import Layout from "./../components/Layout";

import { Link } from "./../routes";

import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS

const CampaignIndex = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        let campaigns = await instance.methods.getDeployedCampaigns().call();

        //let campaigns = ["01", "02", "03"];

        setCampaigns(campaigns);
      } catch (err) {
        console.error(err);
        const message =
          err?.message || err?.data?.message || JSON.stringify(err);
        setError("Failed to load campaigns" + message);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h2>Open Campaigns</h2>
        <Link route="/campaigns/new">
          <a>
            <Button icon labelPosition="right" primary floated="right">
              Add Campaign
              <Icon name="add circle" />
            </Button>
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export default CampaignIndex;
