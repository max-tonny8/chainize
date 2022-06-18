import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import config from "config-global";

// Thirdweb is insane tool which helps with development
// of small smart-contracts (usually the ones which are
// requested by my clients). There is a small script which
// will deploy ERC-20 Token to selected blockchain.
// https://portal.thirdweb.com/typescript

console.log(config.SAMPLE);

// const privateKey = "0x...";
// const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "rinkeby");

// const deployedToken = sdk.deployer.deployToken({
//   name: "Test Token",
//   symbol: "TTTT",
// });

// const token = sdk.getToken(deployedToken);
// const walletAddress = "0x...";

// await token.mintTo(walletAddress, 100);
