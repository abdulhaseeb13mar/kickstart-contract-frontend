import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";
import web3 from "../../../ethereum/web3";

function RequestsList(props) {
  useEffect(() => {
    getCurrentAccount();
    window.ethereum.on("accountsChanged", (accounts) =>
      setCurrentAccount(accounts[0])
    );
  }, []);
  const [currentAccount, setCurrentAccount] = useState("");

  const getCurrentAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0]);
  };

  const renderRows = () => {
    return props.requests.map((request, index) => (
      <RequestRow
        request={request}
        key={index}
        address={props.address}
        id={index}
        approversCount={props.approversCount}
        manager={props.manager}
        currentAccount={currentAccount}
      />
    ));
  };

  return (
    <Layout>
      <h3>Requests</h3>
      {currentAccount.toUpperCase() === props.manager.toUpperCase() && (
        <Link route={`/campaigns/${props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              New Request
            </Button>
          </a>
        </Link>
      )}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
      <div>Found {props.requestsCount} requests</div>
    </Layout>
  );
}

RequestsList.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  const manager = await campaign.methods.manager().call();

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((element, index) => campaign.methods.requests(index).call())
  );

  return {
    address: props.query.address,
    requests,
    requestsCount,
    approversCount,
    manager,
  };
};

export default RequestsList;
