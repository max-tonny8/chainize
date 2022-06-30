import { config } from "dotenv";
import findUp from "find-up";
import { cleanEnv, json, str } from "envalid";

config({ path: findUp.sync(".env") });

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production"], default: 'development' }),
  EVM_NETWORK: str({devDefault: "rinkeby"}),
  EVM_PRIVATE_KEY: str({devDefault: '2ff5e84778923134c187b071c53c2f405b38748997706cc23bdd6b63411692c4' }),
  /** `EVM_ADDRESS` stands for public address on EVM-based networks. */
  EVM_ADDRESS: str({devDefault: '0xC5702332b89000aA73ea8F497C888aDcf0829A85'}),
  SOLANA_KEYPAIR: json({
    devDefault: [180,225,110,224,110,75,66,169,107,169,22,255,127,220,5,145,106,23,74,247,247,46,149,51,76,206,136,81,38,112,212,164,243,40,232,116,66,70,45,87,22,148,26,35,133,23,202,199,72,235,50,74,1,71,111,243,93,136,194,63,8,85,149,117],
  }),
  SOLANA_ID: str({
    default: `${process.env["HOME"]}/.config/solana/id.json`,
  }),
  SOLANA_NETWORK: str({
    devDefault: `https://api.devnet.solana.com`
  }),
  SOLANA_CONFIG: str({
    default: `${process.env["HOME"]}/.config/solana/cli/config.yml`,
  }),
  SOLANA_RECOVERY: str({
    devDefault: "knife orchard slide ugly decide worth hybrid enrich noise possible favorite nice" })
});

export default env;
