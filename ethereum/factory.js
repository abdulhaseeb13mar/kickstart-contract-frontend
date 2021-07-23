import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xd7064f3B27A6c6F2FEb8F97658c48146791e8ed0"
);

export default instance;
