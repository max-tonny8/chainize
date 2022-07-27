import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL, Sample } from "../target/types/sample";
import { IdlAccounts, SplToken } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
  program: anchor.Program<Program>;
}>;

test.before(async (t) => {
  anchor.setProvider(anchor.Provider.local());
  anchor.setProvider(t.context.provider);
  const workspace: anchor.Program & any = anchor.workspace;
  t.context.program = new anchor.Program(IDL, workspace.program.programId);
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

test("asd", async (t) => {
  const program = anchor.workspace.program;
  console.log(program);
  // Execute the RPC.
  await program.rpc.initialize();
});

test.todo("should initizalize program state");
test.todo("should intialize escrow");
test.todo("should exchange escrow state");
test.todo("should initialize and cancel escrow");
