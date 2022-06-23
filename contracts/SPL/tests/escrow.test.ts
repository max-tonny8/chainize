import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL, EscrowProgram } from "../target/types/escrow_program";

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
  program: anchor.Program<EscrowProgram>;
}>;

test.before((t) => {
  t.context.provider = anchor.AnchorProvider.env();
  anchor.setProvider(t.context.provider);
  const workspace: anchor.Program & any = anchor.workspace;
  t.context.program = new anchor.Program(IDL, workspace.Token.programId);
});

test.todo("should initizalize program state");
test.todo("should intialize escrow");
test.todo("should exchange escrow state");
test.todo("should initialize and cancel escrow");
