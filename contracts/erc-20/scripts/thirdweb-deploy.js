import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const privateKey = "0x...";
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "rinkeby");

const deployedToken = sdk.deployer.deployToken({
  name: "Test Token",
  symbol: "TTTT",
});

const token = sdk.getToken(deployedToken);
const walletAddress = "0x...";

await token.mintTo(walletAddress, 100);
