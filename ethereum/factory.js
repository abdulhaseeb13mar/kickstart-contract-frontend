import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0c0D167C1F9e4dDB080FACb640b93CBC20a78255"
);

export default instance;
