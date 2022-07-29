use crate::state::game::*;
use anchor_lang::prelude::*;

pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
    ctx.accounts.game.start([ctx.accounts.player_one.key(), player_two])
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    // NOTE 'init' creates rent-exempt accounts and sb has to pay
    // NOTE You can also compute space by: mem::size_of<Game>() + 9
    #[account(init, payer = player_one, space = 8 + Game::MAXIMUM_SIZE)]
    pub game: Account<'info, Game>,
    // If we want to take money from sb, we should make them sign
    // and mark their account mutable
    #[account(mut)]
    pub player_one: Signer<'info>,
    // Since 'init' creates the game account by making a call
    // to the system program, we need to add the system program
    // to this instruction validation struct
    pub system_program: Program<'info, System>,
}
