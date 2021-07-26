import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Link, Router } from "../../../routes";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { ToastContainer, toast } from "react-toastify";

function NewRequest(props) {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

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

  const onSubmit = async () => {
    setLoading(true);
    setErrMsg("");
    const campaign = Campaign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] })
        .once("sent", () => notify("info", "Processing..."))
        .once("transactionHash", () => notify("info", "Hash received..."))
        .once("receipt", () => notify("success", "Transaction successfull!!"));
      Router.pushRoute(`/campaigns/${props.address}/requests`);
    } catch (error) {
      setErrMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${props.address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errMsg}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errMsg} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
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
    </Layout>
  );
}

NewRequest.getInitialProps = async (props) => {
  return {
    address: props.query.address,
  };
};

export default NewRequest;
