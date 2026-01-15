import React, { useEffect, useState } from "react";
import instance from "../ethereum/factory";
import { Card, Button, Icon } from "semantic-ui-react";
import Layout from "./../components/Layout";

import { Link } from "./../routes";

import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS

const CampaignShow = () => {
  //const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {}, []);

  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default CampaignShow;
