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
    devDefault: [
      248, 235, 155, 185, 196, 200, 22, 198, 198, 58, 53, 167, 128, 71, 128,
      209, 98, 194, 172, 224, 30, 2, 155, 148, 152, 193, 239, 32, 95, 117, 211,
      179, 233, 157, 39, 3, 173, 78, 210, 153, 53, 159, 163, 71, 89, 158, 187,
      71, 33, 178, 150, 162, 49, 172, 186, 225, 80, 105, 47, 141, 224, 222, 252,
      175,
    ],
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
