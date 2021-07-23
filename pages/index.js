import "semantic-ui-css/semantic.min.css";
import React, { useEffect } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";

function Newcampaign(props) {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaign</h3>
      <Button floated="right" content="Create Campaign" icon="add" primary />
      {renderCampaigns()}
    </Layout>
  );
}

Newcampaign.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Newcampaign;
