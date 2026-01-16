import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./../../components/Layout";
import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS
import Campaign from "./../../ethereum/campaign";
import { CardGroup } from "semantic-ui-react";
import web3 from "./../../ethereum/web3";
import ContributeForm from "../../ethereum/ContributeForm";

const CampaignShow = (props) => {
  const [address, setAddress] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({
    minimumContribution: "0",
    balance: "0",
    requestsCount: "0",
    approversCount: "0",
    manager: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const pathParts = router.asPath.split("/");
    const addr = pathParts[pathParts.length - 1]; // get last segment

    setAddress(addr);
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!address) return;
    loadCampaignDetails();
  }, [address]);

  const loadCampaignDetails = async () => {
    console.log("loadCampaignDetails");
    if (!address) return;
    console.log("loadCampaignDetails", address);
    const campaignContract = Campaign(address);
    const compaignDetails = await campaignContract.methods
      .getCampaignDetails()
      .call();

    const campaignObj = {
      minimumContribution: compaignDetails[0].toString(),
      balance: compaignDetails[1].toString(),
      requestsCount: compaignDetails[2].toString(),
      approversCount: compaignDetails[3].toString(),
      manager: compaignDetails[4],
    };
    setCampaignDetails(campaignObj);
    console.log("campaignObj", campaignObj);
  };

  const renderCards = () => {
    const items = [
      {
        header: campaignDetails.manager,
        description: "The manager created this campaign",
        meta: "Address of manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: campaignDetails.minimumContribution,
        description: "Minimum Contribution (WEI)",
        meta: "Minimum amount to be contributor",
      },
      {
        header: web3.utils.fromWei(campaignDetails.balance, "ether"),
        description: "Current Balance of the campaign. (Ether)",
        meta: "Balance",
      },
      {
        header: campaignDetails.requestsCount,
        description: "Number of requests to create the campaign",
        meta: "Number",
      },
      {
        header: campaignDetails.approversCount,
        description: "Number of approvers",
        meta: "Number",
      },
    ];
    return <CardGroup items={items} />;
  };

  return (
    <Layout>
      <div>{renderCards()}</div>
      <div>
        <ContributeForm
          minimumContribution={campaignDetails.minimumContribution}
          address={address}
          onContributionSuccess={loadCampaignDetails}
        ></ContributeForm>
      </div>
    </Layout>
  );
};

export default CampaignShow;
