import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

function CampaignShow(props) {
  const renderCards = () => {
    const {
      balance,
      minimumContribution,
      requestsCount,
      approversCount,
      manager,
    } = props;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: `${minimumContribution} wei`,
        meta: "Minimum Contribution (wei)",
        description:
          "you must contribute at least this much wei to become contributor",
      },
      {
        header: requestsCount,
        meta: "number of Requests",
        description:
          "A request tries to withdraw money from the contract, request must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spent",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        {props.campaignName}
      </h1>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={props.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);

  const summary = await campaign.methods.getSummary().call();

  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
    address: props.query.address,
    campaignName: summary[5],
  };
};
export default CampaignShow;
