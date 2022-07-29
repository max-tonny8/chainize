import * as anchor from "@project-serum/anchor";
import { Program, AnchorError } from "@project-serum/anchor";
import { expect } from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

// Helper function
async function play(
  program: Program<TicTacToe>,
  game,
  player,
  tile,
  expectedTurn,
  expectedGameState,
  expectedBoard
) {
  // Send the actual instruction
  await program.methods
    .play(tile)
    .accounts({
      player: player.publicKey,
      game,
    })
    .signers(player instanceof (anchor.Wallet as any) ? [] : [player])
    .rpc();

  const gameState = await program.account.game.fetch(game);
  expect(gameState.turn).to.equal(expectedTurn);
  expect(gameState.state).to.eql(expectedGameState);
  expect(gameState.board).to.eql(expectedBoard);
}

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.local());

  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  it("setup game!", async () => {
    /** Generate game keypair. */
    const gameKeypair = anchor.web3.Keypair.generate();
    /** playerOne is NOT a Keypair, but the wallet of program's provider and the Provider serves as the keypair that pays for and signs all transactions */
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    // 2. Next, send the transaction
    // Q: Some of the args for setupGame() seem to be not needed.
    // E.g., signers doesn't include playerOne, though we specify it
    // in our program
    // A: We don't add playerOne because it is the program provider,
    // which signs the transaction by default!
    // A: We also don't specify system_program acount (in accounts {}),
    // because Anchor recognizes this account and is able to infer it
    // NOTE This is true for other known accounts (token_program, rent sysvar account, etc)
    await program.methods
      .setupGame(playerTwo.publicKey) // instruction arguments
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      }) // accounts
      .signers([gameKeypair])
      // We have to add gameKeypair for signers bc whenever an account gets
      // created, it has to sign its creation transaction
      .rpc();

    // 3. After the transaction returns, we can fetch the state of the game account
    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    // 4. Verify the game has set up correctly
    // https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });

  it("player one wins", async () => {
    // 1. Generate some keypairs
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    // 2. Send the transaction to setup a new game
    await program.methods
      .setupGame(playerTwo.publicKey) // instruction arguments
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      }) // accounts
      .signers([gameKeypair])
      // We have to add gameKeypair for signers bc whenever an account gets
      // created, it has to sign its creation transaction
      .rpc();

    // 3. After the transaction returns, we can fetch the state of the game account
    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    // 4. Verify the game has set up correctly
    // https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    // 5. Finally, let's use the helper fn to play some turns
    // NOTE We'll need to play/simulate a real game of plays
    // to make playerOne win
    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 0 },
      2,
      { active: {} }, // NOTE Check Rust/TS types reference
      [
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null],
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 0 },
      3,
      { active: {} }, // NOTE Check Rust/TS types reference
      [
        [{ x: {} }, null, null],
        [{ o: {} }, null, null],
        [null, null, null],
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 1 },
      4,
      { active: {} }, // NOTE Check Rust/TS types reference
      [
        [{ x: {} }, { x: {} }, null],
        [{ o: {} }, null, null],
        [null, null, null],
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerTwo,
      { row: 1, column: 1 },
      5,
      { active: {} }, // NOTE Check Rust/TS types reference
      [
        [{ x: {} }, { x: {} }, null],
        [{ o: {} }, { o: {} }, null],
        [null, null, null],
      ]
    );

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 2 },
      5, // NOTE When status == 'won', then it doesn't increment game.turn
      { won: { winner: playerOne.publicKey } },
      [
        [{ x: {} }, { x: {} }, { x: {} }],
        [{ o: {} }, { o: {} }, null],
        [null, null, null],
      ]
    );
  });

  it("out of bounds row", async () => {
    // 1. Generate some keypairs
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    // 2. Send the transaction to setup a new game
    await program.methods
      .setupGame(playerTwo.publicKey) // instruction arguments
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      }) // accounts
      .signers([gameKeypair])
      // We have to add gameKeypair for signers bc whenever an account gets
      // created, it has to sign its creation transaction
      .rpc();

    // 3. After the transaction returns, we can fetch the state of the game account
    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    // 4. Verify the game has set up correctly
    // https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    // 5. Send the instruction
    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        { row: 5, column: 0 }, // ERROR
        2,
        { active: {} }, // NOTE Check Rust/TS types reference
        [
          [{ x: {} }, null, null],
          [null, null, null],
          [null, null, null],
        ]
      );
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.number).to.equal(6000);
    }
  });

  it("same player in subsequent turns", async () => {
    // 1. Generate some keypairs
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    // 2. Send the transaction to setup a new game
    await program.methods
      .setupGame(playerTwo.publicKey) // instruction arguments
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      }) // accounts
      .signers([gameKeypair])
      // We have to add gameKeypair for signers bc whenever an account gets
      // created, it has to sign its creation transaction
      .rpc();

    // 3. After the transaction returns, we can fetch the state of the game account
    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    // 4. Verify the game has set up correctly
    // https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    // 5. Send instructions to simulate error
    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        { row: 0, column: 0 },
        2,
        { active: {} }, // NOTE Check Rust/TS types reference
        [
          [{ x: {} }, null, null],
          [null, null, null],
          [null, null, null],
        ]
      );
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
    }

    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        { row: 0, column: 1 },
        3,
        { active: {} },
        [
          [{ x: {} }, { x: {} }, null],
          [null, null, null],
          [null, null, null],
        ]
      );
    } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
    }
  });
});
