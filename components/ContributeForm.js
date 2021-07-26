import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import { ToastContainer, toast } from "react-toastify";

function ContributeForm(props) {
  const [value, setValue] = useState("");
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

  const onSubmit = async (e) => {
    setLoading(true);
    setErrMsg("");
    e.preventDefault();
    const campaign = Campaign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(value, "ether"),
        })
        .once("sent", () => notify("info", "Processing..."))
        .once("transactionHash", () => notify("info", "Hash received..."))
        .once("receipt", () => notify("success", "Transaction successfull!!"));
      Router.replaceRoute(`/campaigns/${props.address}`);
    } catch (err) {
      setErrMsg(err.message);
    }
    setLoading(false);
    setValue("");
  };

  return (
    <Form onSubmit={onSubmit} error={!!errMsg}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="ether"
          labelPosition="right"
          type="number"
        />
      </Form.Field>
      <Message error header="Oops!" content={errMsg} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
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
    </Form>
  );
}

export default ContributeForm;
