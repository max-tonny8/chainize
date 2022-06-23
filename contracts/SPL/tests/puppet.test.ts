import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";

const test = undefinedtest as TestFn<{}>;

test("Performs CPI from puppet master to puppet", async (t) => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const puppetMaster = anchor.workspace.PuppetMaster;
  const puppet = anchor.workspace.Puppet;

  // Initialize a new puppet account.
  const newPuppetAccount = anchor.web3.Keypair.generate();

  const tx = await puppet.rpc.initialize({
    accounts: {
      puppet: newPuppetAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [newPuppetAccount],
  });

  // Invoke the puppet master to perform a CPI to the puppet.
  await puppetMaster.rpc.pullStrings(new anchor.BN(111), {
    accounts: {
      puppet: newPuppetAccount.publicKey,
      puppetProgram: puppet.programId,
    },
  });

  // Check the state updated.
  const puppetAccount = await puppet.account.data.fetch(
    newPuppetAccount.publicKey
  );

  t.true(puppetAccount.data.eq(new anchor.BN(111)));
});
