/* eslint-disable node/no-unpublished-import */
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import config from "@chainized/config";

export async function main() {
  // Thirdweb is insane tool which helps with development
  // of small smart-contracts (usually the ones which are
  // requested by my clients). There is a small script which
  // will deploy ERC-20 Token to selected blockchain.
  // https://portal.thirdweb.com/typescript

  const privateKey = config.EVM_PRIVATE_KEY;

  const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "rinkeby");

  const deployedToken = await sdk.deployer.deployToken({
    name: "Test Token",
    symbol: "TTTT",
    primary_sale_recipient: config.EVM_ADDRESS,
  });

  const token = sdk.getToken(deployedToken);
  const walletAddress = config.EVM_ADDRESS;

  await token.mintTo(walletAddress, 100);

  console.log(deployedToken);
}
