import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import config from "config-global";

// Thirdweb is insane tool which helps with development
// of small smart-contracts (usually the ones which are
// requested by my clients). There is a small script which
// will deploy ERC-20 Token to selected blockchain.
// https://portal.thirdweb.com/typescript

const privateKey = config.EVM_PRIVATE_KEY;
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "rinkeby");

const deployedToken = sdk.deployer.deployToken({
  name: "Test Token",
  symbol: "TTTT",
  primary_sale_recipient: config.EVM_ADDRESS,
});

const token = sdk.getToken(deployedToken);
const walletAddress = config.EVM_ADDRESS;

await token.mintTo(walletAddress, 100);
