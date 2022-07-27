import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import spawn from "cross-spawn";
import path from "path";

import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectName = "solek";

const programAuthorityKeyfileName = `../../.solana/keinsell.json`;
const programAuthorityKeypairFile = path.resolve(
  `${__dirname}${path.sep}${programAuthorityKeyfileName}`
);

const programKeyfileName = `target/deploy/${projectName}-keypair.json`;
const programKeypairFile = path.resolve(
  `${__dirname}${path.sep}${programKeyfileName}`
);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

function readKeyfile(keypairfile) {
  let kf = fs.readFileSync(keypairfile);
  let parsed = JSON.parse(kf.toString()); // [1,1,2,2,3,4]
  kf = new Uint8Array(parsed);
  const keypair = Keypair.fromSecretKey(kf);
  return keypair;
}

(async () => {
  let method;
  let programAuthorityKeypair;
  let programId;
  let programKeypair;

  programKeypair = readKeyfile(programKeypairFile);
  console.log({ publicKey: programKeypair.publicKey });
  programId = programKeypair.publicKey.toString();
  fs.createWriteStream("keypair.txt").write(programId);
})();
