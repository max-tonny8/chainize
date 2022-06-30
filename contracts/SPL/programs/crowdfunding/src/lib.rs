use anchor_lang::prelude::*;

declare_id!("7QF5Q3uWmFpxxu2HYvP3YNg9fYYGssTdqqb7Tcc8wpZt");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
