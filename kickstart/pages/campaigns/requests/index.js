import React, { useEffect, useState } from "react";
import Campaign from "./../../../ethereum/campaign";
import { Button, Grid } from "semantic-ui-react";
import Layout from "./../../../components/Layout";
import { Link } from "./../../../routes";
import { useRouter } from "next/router";

const RequestIndex = () => {
  const [campaignRequestsCount, setCampaignRequestsCount] = useState("0");

  const router = useRouter();
  const { address } = router.query;


  const toBytes32 = (text) => {
    return web3.utils.padRight(web3.utils.utf8ToHex(text), 64);
  }

  const bytes32ToString = (bytes32Str) => {
    return web3.utils.hexToUtf8(bytes32Str).replace(/\0+$/, "");
  }

 
  // Standalone async function
  const loadRequests = async (campaignAddress) => {
    if (!campaignAddress) return;

    try {
      const campaignContract = Campaign(campaignAddress);
      const requestCount = await campaignContract.methods.getRequestCount().call();
      setCampaignRequestsCount(requestCount.toString()); // Convert BigInt to string
      console.log("Request Count:", requestCount.toString());
    } catch (err) {
      console.error("Failed to load request count:", err);
    }
  };

  // Effect runs when the address becomes available
  useEffect(() => {
    if (!address) return;
    loadRequests(address);
  }, [address]);

    // Effect runs when the address becomes available
  useEffect(async () => {
    console.log("campaignRequestsCount trigger")

    const campaignContract = Campaign(address);

    console.log("campaignRequestsCount",campaignRequestsCount)

    for(let i = 0;i<campaignRequestsCount;i++){

      const requestCount = await campaignContract.methods.requests(i).call();
      console.log(requestCount)
    }
    
  }, [campaignRequestsCount]);

  if (!address) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h3>Requests</h3>

      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <p>Number of Requests: {campaignRequestsCount}</p>
          </Grid.Column>

          <Grid.Column width={6}>
            {address && (
              <Link route={`/campaigns/${address}/requests/new`}>
                <Button primary>Create Request</Button>
              </Link>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default RequestIndex;
