import { config } from "dotenv";
import findUp from "find-up";
import { cleanEnv, str } from "envalid";

config({ path: findUp.sync(".env") });

const env = cleanEnv(process.env, {
  EVM_NETWORK: str(),
  EVM_PRIVATE_KEY: str(),
  /** `EVM_ADDRESS` stands for public address on EVM-based networks. */
  EVM_ADDRESS: str(),
});

export default env;
