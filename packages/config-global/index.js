import dotenv from "dotenv";
import { findUpSync } from "find-up";

dotenv.config({ path: findUpSync(process.env.ENV_FILE || ".env") });

// TODO: There we need validation of environment schema

export default {
  SAMPLE: process.env.SAMPLE,
};
