use crate::errors::TicTacToeError;
use crate::state::game::*;
use anchor_lang::prelude::*;

pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
    let game = &mut ctx.accounts.game;

    // Compare game's current player key w/ Play instruction player key
    // Q: Any way to perform this check earlier? 
    // A: Guess not, since its this play() function call that actually
    // matters (the instruction struct and impl methods are helpers really)
    // A: Inside Play accounts struct, we checked that the player account
    // has signed the transaction, but we do not check that it is the
    // correct player we expect, hence this check:
    require_keys_eq!(
        game.current_player(),
        ctx.accounts.player.key(),
        TicTacToeError::NotPlayersTurn
    );

    game.play(&tile)
}


// NOTE This is sometimes referred as 'the Play accounts struct'
#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>
}
