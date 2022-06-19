import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { App } from "../target/types/app";

describe("app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.App as Program<App>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
