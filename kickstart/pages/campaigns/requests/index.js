import React, { useEffect, useState } from "react";
import Campaign from "./../../../ethereum/campaign";
import { Button, Grid } from "semantic-ui-react";
import Layout from "./../../../components/Layout";
import { Link } from "./../../../routes";
import { useRouter } from "next/router";
import web3 from "./../../../ethereum/web3";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  MenuItem,
  Icon,
  Label,
  Menu,
  Table,
} from "semantic-ui-react";
import RequestRow from "./../../../components/RequestRow";

const RequestIndex = () => {
  const [requests, setRequests] = useState([]);
  const [campaignContract, setCampaignContract] = useState(null);

  const router = useRouter();
  const { address } = router.query;

  const toBytes32 = (text) => {
    return web3.utils.padRight(web3.utils.utf8ToHex(text), 64);
  };

  const bytes32ToString = (bytes32Str) => {
    return web3.utils.toAscii(bytes32Str).replace(/\0/g, "");
  };

  // Standalone async function
  const loadRequests = async (campaignAddress) => {
    if (!campaignAddress) return;

    try {
      const contract = Campaign(campaignAddress); // LOCAL
      setCampaignContract(contract); // store for children

      const campaignRequestsCount = await contract.methods
        .getRequestCount()
        .call()
        .toString();

      const loadedRequests = await Promise.all(
        Array(campaignRequestsCount)
          .fill()
          .map(async (element, index) => {
            return await contract.methods.requests(index).call();
          }),
      );

      setRequests(loadedRequests);

      console.log(loadedRequests);
    } catch (err) {
      console.error("Failed to load request count:", err);
    }
  };

  // Effect runs when the address becomes available
  useEffect(() => {
    if (!address) return;
    loadRequests(address);
  }, [address]);

  if (!address)
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );

  const { Header, Row, HeaderCell, Body } = Table;

  const renderRow = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          id={index}
          address={address}
          campaign={campaignContract}
        ></RequestRow>
      );
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      {address && (
        <Link route={`/campaigns/${address}/requests/new`}>
          <Button primary style={{ marginBottom: "20px" }}>
            Create Request
          </Button>
        </Link>
      )}
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Table>
              <Header>
                <Row>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                  <HeaderCell>Amount</HeaderCell>
                  <HeaderCell>Recipient</HeaderCell>
                  <HeaderCell>Approval Count</HeaderCell>
                  <HeaderCell>Approve</HeaderCell>
                  <HeaderCell>Finalize</HeaderCell>
                </Row>
              </Header>
              <Body>{renderRow()}</Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default RequestIndex;
