import undefinedtest, { TestFn } from "ava";
import * as anchor from "@project-serum/anchor";
import { IDL as Puppet } from "../target/types/puppet";
import { IDL as PuppetMaster } from "../target/types/puppet_master";

const test = undefinedtest as TestFn<{
  provider: anchor.AnchorProvider;
}>;

test.before((t) => {
  t.context.provider = anchor.AnchorProvider.env();
  anchor.setProvider(t.context.provider);
});

test("Performs CPI from puppet master to puppet", async (t) => {
  const puppetMaster: anchor.Program & any = anchor.workspace.PuppetMaster;
  const puppet: anchor.Program & any = anchor.workspace.Puppet;

  //   const _programPM = new anchor.Program(PuppetMaster, puppetMaster.programId);
  const puppet_program = new anchor.Program(Puppet, puppet.programId);
  const puppetMaster_program = new anchor.Program(
    PuppetMaster,
    puppetMaster.programId
  );

  // Initialize a new puppet account.
  const newPuppetAccount = anchor.web3.Keypair.generate();

  /* Initializing the puppet program. */
  await puppet_program.rpc.initialize({
    accounts: {
      puppet: newPuppetAccount.publicKey,
      user: t.context.provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [newPuppetAccount],
  });

  // Invoke the puppet master to perform a CPI to the puppet.
  await puppetMaster_program.rpc.pullStrings(new anchor.BN(111), {
    accounts: {
      puppet: newPuppetAccount.publicKey,
      puppetProgram: puppet.programId,
    },
  });

  // Check the state updated.
  const puppetAccount = await puppet_program.account.data.fetch(
    newPuppetAccount.publicKey
  );

  /* Checking that the puppetAccount.data is equal to 111. */
  t.true(puppetAccount.data.eq(new anchor.BN(111)));
});
