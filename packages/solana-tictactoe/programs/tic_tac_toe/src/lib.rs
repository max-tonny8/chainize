// NOTE https://book.anchor-lang.com/anchor_in_depth/milestone_project_tic-tac-toe.html
use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("H977Pr3fnrGuyfrgtbWkBVsQmR6jXbeiceDfBPKhRgBx");

#[program]
pub mod tic_tac_toe {
    use super::*;
    
    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        instructions::setup_game::setup_game(ctx, player_two)
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        instructions::play::play(ctx, tile)
    }
}


// === NOTE Code before restructuring into multiple files:
// // NOTE https://book.anchor-lang.com/anchor_in_depth/milestone_project_tic-tac-toe.html
// use anchor_lang::prelude::*;
// use num_derive::*;
// use num_traits::*;
// use program::TicTacToe;

// declare_id!("H977Pr3fnrGuyfrgtbWkBVsQmR6jXbeiceDfBPKhRgBx");

// #[program]
// pub mod tic_tac_toe {
//     use super::*;

//     pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
//         ctx.accounts.game.start([ctx.accounts.player_one.key(), player_two]);
//         Ok(())
//     }

//     pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
//         let game = &mut ctx.accounts.game;

//         // Compare game's current player key w/ Play instruction player key
//         // Q: Any way to perform this check earlier? 
//         // A: Guess not, since its this play() function call that actually
//         // matters (the instruction struct and impl methods are helpers really)
//         // A: Inside Play accounts struct, we checked that the player account
//         // has signed the transaction, but we do not check that it is the
//         // correct player we expect, hence this check:
//         require_keys_eq!(
//             game.current_player(),
//             ctx.accounts.player.key(),
//             TicTacToeError::NotPlayersTurn
//         );

//         game.play(&tile)
//     }
// }

// // === Instructions
// #[derive(Accounts)]
// pub struct SetupGame<'info> {
//     // NOTE 'init' creates rent-exempt accounts and sb has to pay
//     // NOTE You can also compute space by: mem::size_of<Game>() + 9
//     #[account(init, payer = player_one, space = 8 + Game::MAXIMUM_SIZE)]
//     pub game: Account<'info, Game>,
//     // If we want to take money from sb, we should make them sign
//     // and mark their account mutable
//     #[account(mut)]
//     pub player_one: Signer<'info>,
//     // Since 'init' creates the game account by making a call
//     // to the system program, we need to add the system program
//     // to this instruction validation struct
//     pub system_program: Program<'info, System>,
// }

// // NOTE This is sometimes referred as 'the Play accounts struct'
// #[derive(Accounts)]
// pub struct Play<'info> {
//     #[account(mut)]
//     pub game: Account<'info, Game>,
//     pub player: Signer<'info>
// }


// // === Accounts
// #[account]
// pub struct Game {
//     players: [Pubkey; 2], // (32 * 2) = 64
//     turn: u8, // 1
//     board: [[Option<Sign>; 3]; 3], // 9 * (1 + 1) = 18
//     state: GameState, // 32 + 1
// }

// impl Game {
//     pub const MAXIMUM_SIZE: usize = (32 * 2) + 1 + (9 * (1 + 1)) + (32 + 1);
    
//     pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
//         require_eq!(self.turn, 0, TicTacToeError::GameAlreadyStarted);
//         self.players = players;
//         self.turn = 1;
//         Ok(())
//     }

//     pub fn is_active(&self) -> bool {
//         self.state == GameState::Active
//     }

//     pub fn current_player_index(&self) -> usize {
//         ((self.turn - 1) % 2) as usize
//     }

//     pub fn current_player(&self) -> Pubkey {
//         // Find the matching Pubkey in the players Array?
//         // Or, better, get the current player index
//         // and then access that from players array
//         self.players[self.current_player_index()]
//     }

//     pub fn play(&mut self, tile: &Tile) -> Result<()> {
//         require!(self.is_active(), TicTacToeError::GameAlreadyOver);

//         // Determine the tile
//         // See if there is an existing Sign?
//         match tile {
//             tile @ Tile {
//                 row: 0..=2,
//                 column: 0..=2,
//             } => match self.board[tile.row as usize][tile.column as usize] {
//                 Some(_) => return Err(TicTacToeError::TileAlreadySet.into()),
//                 None => {
//                     self.board[tile.row as usize][tile.column as usize] = 
//                         Some(Sign::from_usize(self.current_player_index()).unwrap());
//                 }
//             },
//             _ => return Err(TicTacToeError::TileOutOfBounds.into()),
//         }

//         self.update_state();

//         if GameState::Active == self.state {
//             self.turn += 1;
//         }

//         Ok(())
//     }

//     fn is_winning_trio(&self, trio: [(usize, usize); 3]) -> bool {
//         let [first, second, third] = trio;

//         self.board[first.0][first.1].is_some() // Has either 'X' or 'O'
//             && self.board[first.0][first.1] == self.board[second.0][second.1]
//             && self.board[first.0][first.1] == self.board[third.0][third.1]
//     }

//     fn update_state(&mut self) {
//         for i in 0..=2 {
//             // three of the same in one ROW
//             if self.is_winning_trio([(i, 0), (i, 1), (i, 2)]) {
//                 self.state = GameState::Won { winner: self.current_player() };
//                 return;
//             }
//             // three of the same in one COL
//             if self.is_winning_trio([(0, i), (1, i), (2, i)]) {
//                 self.state = GameState::Won { winner: self.current_player() };
//                 return;
//             }
            
//             // three of the same in one diagonal
//             if self.is_winning_trio([(0, 0), (1, 1), (2, 2)])
//                 || self.is_winning_trio([(0, 2), (1, 1), (2, 0)])
//             {
//                 self.state = GameState::Won { winner: self.current_player() };
//                 return;
//             }

//             // Game has not been won, check if there are unfilled tiles (active)
//             for row in 0..=2 {
//                 for column in 0..=2 {
//                     if self.board[row][column].is_none() {
//                         self.state = GameState::Active;
//                         return;
//                     }
//                 }
//             }
    

//             // Game ends in tie (all filled, no win)
//             self.state = GameState::Tie;
//         }
//     }
// }

// #[derive(AnchorSerialize, AnchorDeserialize)]
// pub struct Tile {
//     row: u8,
//     column: u8,
// }

// #[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
// pub enum GameState {
//     Active,
//     Tie,
//     Won { winner: Pubkey },
// }

// #[derive(
//     AnchorSerialize,
//     AnchorDeserialize,
//     FromPrimitive,
//     ToPrimitive,
//     Copy,
//     Clone,
//     PartialEq,
//     Eq
// )]
// pub enum Sign {
//     X,
//     O,
// }

// #[error_code]
// pub enum TicTacToeError {
//     TileOutOfBounds,
//     TileAlreadySet,
//     NotPlayersTurn,
//     GameAlreadyStarted,
//     GameAlreadyOver,
// }
