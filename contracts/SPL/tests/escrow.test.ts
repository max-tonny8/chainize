import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL, Escrow } from "../target/types/escrow";
import { IdlAccounts, SplToken } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

type EscrowAccount = IdlAccounts<Escrow>["escrowAccount"];

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
  program: anchor.Program<Escrow>;
  tokenA: SplToken;
  tokenB: SplToken;
  // Initalizer Account for Escrow
  initializerTokenAccountA: PublicKey;
  initializerTokenAccountB: PublicKey;
  // Taker Account for Escrow
  takerTokenAccountA: PublicKey;
  takerTokenAccountB: PublicKey;
  // PDA
  pda: PublicKey;
  // Amounts of Tokens
  takerAmount: number;
  initalizerAmount: number;
  // Keypairs
  escrowKeypair: Keypair;
  payerKeypair: Keypair;
  mintAuthority: Keypair;
}>;

test.before(async (t) => {
  t.context.provider = anchor.AnchorProvider.env();
  anchor.setProvider(t.context.provider);
  const workspace: anchor.Program & any = anchor.workspace;
  t.context.program = new anchor.Program(IDL, workspace.Token.programId);

  t.context.payerKeypair = Keypair.generate();

  // DEPRECATED: Research about proper method should be done
  await t.context.provider.connection.confirmTransaction(
    await t.context.provider.connection.requestAirdrop(
      t.context.payerKeypair.publicKey,
      10000000000
    ),
    "confirmed"
  );
});

test.todo("should initizalize program state");
test.todo("should intialize escrow");
test.todo("should exchange escrow state");
test.todo("should initialize and cancel escrow");
