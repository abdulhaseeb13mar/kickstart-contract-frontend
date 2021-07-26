import React, { useEffect } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
import Campaign from "../ethereum/campaign";

function Newcampaign(props) {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address, index) => {
      return {
        header: props.names[index],
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    // const items = [];
    // for (let i = 0; i < props.campaigns.length; i++) {
    //   const campaign = await Campaign(props.campaigns[i]);
    //   const name = await campaign.methods.CampaignName().call();
    //   items.push({
    //     header: name,
    //     description: (
    //       <Link route={`/campaigns/${props.campaigns[i]}`}>
    //         <a>View Campaign</a>
    //       </Link>
    //     ),
    //     fluid: true,
    //   });
    // }
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link route="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add"
            primary
          />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  );
}

Newcampaign.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  const items = [];
  for (let i = 0; i < campaigns.length; i++) {
    const campaign = await Campaign(campaigns[i]);
    const name = await campaign.methods.CampaignName().call();
    items.push(name);
  }
  return { campaigns, names: items };
};

export default Newcampaign;
