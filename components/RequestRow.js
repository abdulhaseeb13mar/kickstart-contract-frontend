import React, { useState, useEffect } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { ToastContainer, toast } from "react-toastify";

function RequestRow(props) {
  const { description, value, recipient, approvalCount, complete } =
    props.request;

  useEffect(() => {
    checkApprove();
  }, [props.currentAccount]);

  const notify = (type, message) =>
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const checkApprove = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();
    const isApproved = await campaign.methods
      .hasApprovedRequest(props.id, accounts[0])
      .call();
    console.log("isApproved", isApproved);
    setHasApproved(isApproved);
  };

  const [hasApproved, setHasApproved] = useState(false);
  const [hasFinalized, setHasFinalized] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [currentApprovers, setCurrentApprovers] = useState(approvalCount);
  const [finalizeLoading, setFinalizeLoading] = useState(false);

  const onApprove = async (e) => {
    e.preventDefault();
    setApproveLoading(true);
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(props.id)
        .send({
          from: accounts[0],
        })
        .once("sent", () => notify("info", "Processing..."))
        .once("transactionHash", () => notify("info", "Hash received..."))
        .once("receipt", () => notify("success", "Transaction successfull!!"));
      checkApprove();
      setCurrentApprovers(parseInt(currentApprovers) + 1);
    } catch (error) {
      //   setApproveLoading(false);
    }

    setApproveLoading(false);
  };

  const onFinalize = async () => {
    setFinalizeLoading(true);
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(props.id)
        .send({
          from: accounts[0],
        })
        .once("sent", () => notify("info", "Processing..."))
        .once("transactionHash", () => notify("info", "Hash received..."))
        .once("receipt", () => notify("success", "Transaction successfull!!"));
      setHasFinalized(true);
    } catch (error) {}
    setFinalizeLoading(false);
  };

  const readyToFinalize = approvalCount > props.approversCount / 2;

  return (
    <Table.Row
      disabled={complete || hasFinalized}
      positive={readyToFinalize && !complete}
    >
      <Table.Cell>{props.id}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(value, "ether")}</Table.Cell>
      <Table.Cell>{recipient}</Table.Cell>
      <Table.Cell>
        {currentApprovers}/{props.approversCount}
      </Table.Cell>
      <Table.Cell>
        {complete ||
        props.approversCount == approvalCount ? null : !hasApproved ? (
          <Button
            color="green"
            basic
            onClick={onApprove}
            loading={approveLoading}
          >
            Approve
          </Button>
        ) : (
          <p>Approved</p>
        )}
      </Table.Cell>
      <Table.Cell>
        {complete || hasFinalized ? null : (
          <Button
            color="teal"
            basic
            loading={finalizeLoading}
            onClick={onFinalize}
            disabled={
              props.currentAccount.toUpperCase() === props.manager.toUpperCase()
                ? readyToFinalize
                  ? false
                  : true
                : true
            }
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Table.Row>
  );
}

export default RequestRow;
