import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL as TokenIDL, Token } from "../target/types/token";

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
  program: anchor.Program<Token>;
}>;

test.before((t) => {
  t.context.provider = anchor.AnchorProvider.env();
  anchor.setProvider(t.context.provider);
  const workspace: anchor.Program & any = anchor.workspace;
  t.context.program = new anchor.Program(TokenIDL, workspace.Token.programId);
});

test.todo("Contract should be able to mint new tokens");
test.todo("Contract should be able to transfer tokens across accounts");
test.todo("Contract should be able to burn tokens");
