import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0004deC35971e75bAC6770F624DF4c6A3481E341"
);

export default instance;
