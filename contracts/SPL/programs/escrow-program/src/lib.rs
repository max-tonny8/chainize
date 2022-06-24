use anchor_lang::prelude::*;

// https://hackmd.io/@ironaddicteddog/solana-anchor-escrow

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod escrow_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        _escrow_account_bump: u8,
        initializer_amount: u64,
        reciever_amount: u64,
    ) -> Result<()> {
        // TODO:
        Ok(())
    }

    pub fn liquidate(ctx: Context<Liquidate>) -> Result<()> {
        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {}

#[derive(Accounts)]
pub struct Liquidate<'info> {}

#[derive(Accounts)]
pub struct Close<'info> {}
