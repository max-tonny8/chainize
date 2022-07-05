import env from "@chainized/config";
import { IDL } from "solana-escrow";
import anchor from "@project-serum/anchor";
// eslint-disable-next-line node/no-extraneous-import
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { mintTo, TokenInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const wallet = new anchor.Wallet(env.SOLANA_KEYPAIR);
const provider = anchor.AnchorProvider.env();

anchor.setProvider(provider);

const escrowProgram = new anchor.Program(
  IDL,
  "GorKJzSmWPpbrwK8zT1MtdBtPn3e5ctbjJnPExYRcUSB"
);

async function main() {
  console.log("Hello World");

  // Airdrop testnet funds

  // const signature = await provider.connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  // if (signature) await provider.connection.confirmTransaction(signature);

  const escrowAccount = Keypair.generate();
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  const takerAmount = 1000;
  const initalizerAmount = 500;

  // Get the escrow account
}

main();
