import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL, Escrow } from "../target/types/escrow";
import { IdlAccounts, SplToken } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

type EscrowAccount = IdlAccounts<Escrow>['escrowAccount']

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
  program: anchor.Program<Escrow>;
}>;

test.before(async (t) => {
  t.context.provider = anchor.AnchorProvider.env();
  anchor.setProvider(t.context.provider);
  const workspace: anchor.Program & any = anchor.workspace;
  t.context.program = new anchor.Program(IDL, workspace.Token.programId);
});

test.todo("should initizalize program state");
test.todo("should mint tokens for address");
test.todo("should have limited capacity of tokens")
test.todo("should burn tokens from address");
test.todo("should transfer ownership of contract");