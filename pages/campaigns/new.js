import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import { ToastContainer, toast } from "react-toastify";

function CampaignNew() {
  const [minContribution, setMinContribution] = useState("0");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      setErrorMsg("Please Enter Campaign name!");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minContribution, name)
        .send({
          from: accounts[0],
        })
        .once("sent", () => notify("info", "Processing..."))
        .once("transactionHash", () => notify("info", "Hash received..."))
        .once("receipt", () => notify("success", "Transaction successfull!!"));
      Router.pushRoute("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Campaign!</h3>
      <Form onSubmit={onSubmit} error={!!errorMsg}>
        <Form.Field>
          <label>Campaign Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            type="number"
            value={minContribution}
            onChange={(e) => setMinContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMsg} />
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

export default CampaignNew;
