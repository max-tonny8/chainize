/* eslint-disable node/no-unpublished-import */
import { HardhatUserConfig } from "hardhat/config";
import env from "@chainized/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

type HardhatTypechainConfig = {
  typechain: {
    outDir: string;
    target: "ethers-v5";
    /** should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads? */
    alwaysGenerateOverloads?: boolean;
    /** optional array of glob patterns with external artifacts to process (for example external libs from node_modules) */
    externalArtifacts?: [string];
    dontOverrideCompile?: boolean;
  };
};

type HardhatConfig = HardhatUserConfig & HardhatTypechainConfig;

const config: HardhatConfig = {
  solidity: "0.8.4",
  paths: {
    root: ".",
    sources: "./src/contracts",
    tests: "./src/test",
    artifacts: "./dist/artifacts",
    cache: "./dist/cache",
  },
  networks: {
    ropsten: {
      url: env.EVM_NETWORK,
      accounts: env.EVM_PRIVATE_KEY !== undefined ? [env.EVM_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  typechain: {
    outDir: "./dist/typechain",
    target: "ethers-v5",
  },
};

export default config;
