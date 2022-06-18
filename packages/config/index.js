import dotenv from "dotenv";
import { findUpSync } from "find-up";
import { cleanEnv, str } from "envalid";

dotenv.config({ path: findUpSync(process.env.ENV_FILE || ".env") });

const env = cleanEnv(process.env, {
  EVM_NETWORK: str(),
  EVM_PRIVATE_KEY: str(),
  /** `EVM_ADDRESS` stands for public address on EVM-based networks. */
  EVM_ADDRESS: str(),
});

export default env;
