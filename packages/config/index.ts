import { config } from "dotenv";
import findUp from "find-up";
import { cleanEnv, json, str } from "envalid";

config({ path: findUp.sync(".env") });

const env = cleanEnv(process.env, {
  EVM_NETWORK: str(),
  EVM_PRIVATE_KEY: str(),
  /** `EVM_ADDRESS` stands for public address on EVM-based networks. */
  EVM_ADDRESS: str(),
  SOLANA_KEYPAIR: json({
    default: [
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
  SOLANA_CONFIG: str({
    default: `${process.env["HOME"]}/.config/solana/cli/config.yml`,
  }),
});

export default env;
