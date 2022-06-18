import { config } from "dotenv";
import { findUpSync } from "find-up";
import { cleanEnv, str } from "envalid";

config({ path: findUpSync(".env") });

const env = cleanEnv(process.env, {
  EVM_NETWORK: str(),
  EVM_PRIVATE_KEY: str(),
  /** `EVM_ADDRESS` stands for public address on EVM-based networks. */
  EVM_ADDRESS: str(),
});

export default env;
