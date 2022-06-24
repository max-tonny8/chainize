use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Mint, SetAuthority, TokenAccount, Transfer};
use spl_token::instruction::AuthorityType;

// https://hackmd.io/@ironaddicteddog/solana-anchor-escrow

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod escrow_program {
    use super::*;

    /// Assign input accounts to `EscrowAccount`, then a **Program Derived Address** is going to become new authority of `master_deposit_token_account`.
    pub fn initialize(
        ctx: Context<Initialize>,
        _vault_account_bump: u8,
        master_amount: u64,
        puppet_amount: u64,
    ) -> Result<()> {
        Ok(())
    }

    /// Transfer **Token A** from `pda_deposit_token_account` to `puppet_receive_token_account`, so we can can transfer **Token B** from `puppet_deposit_token_account` to `master_receive_token_account`. And finally the authority of `pda_deposit_token_account` is going to become `initializer`.
    pub fn release(ctx: Context<Release>) -> Result<()> {
        Ok(())
    }

    /// Reset the authority from **Program Derived Address** back to `master_deposit_token_account`.
    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        Ok(())
    }
}

#[account]
pub struct EscrowAccount {
    // To authorize the actions properly
    /** `PubKey` of person who started a new `EscrowAccount` */
    pub master_key: Pubkey,
    // To record the deposit account of initialzer
    pub master_deposit_token_account: Pubkey,
    // To record the receiving account of initializer
    pub master_recieve_token_account: Pubkey,
    // To record how much token should the initializer transfer to taker
    pub master_amount: u64,
    // To record how much token should the initializer receive from the taker
    pub puppet_amount: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// Signer of `InitialEscrow` instruction. To be stored in `EscrowAccount`
    master: AccountInfo,
    /// The account of token account for token exchange. To be stored in `EscrowAccount`
    master_deposit_token_account: Account<TokenAccount>,
    /// Account of token account for token exchange. To be stored in `EscrowAccount`
    master_receive_token_account: Account<TokenAccount>,
    /// The account of `TokenProgram`
    token_program: Account<TokenProgram>,
    /// The account of `EscrowAccount`
    escrow_account: Account<EscrowAccount>,
    /// The account of `Vault`, which is created by Anchor via constraints.
    valut_account: Account<'info, ValutAccount>,
    mint: Account<'info, Mint>,
    system_program: AccountInfo<'info>,
    rent: Sysvar<Rent>,
}

#[derive(Accounts)]
pub struct Release<'info> {
    /// Signer of `Release` instruction
    pub puppet: AccountInfo<'info>,
    /// Token account for token exchange
    pub puppet_deposit_token_account: Account<TokenAccount>,
    /// Token account for token exchange
    pub puppet_receive_token_account: Account<TokenAccount>,
    /// Token account for token exchange
    pub master_deposit_token_account: Account<'info, TokenAccount>,
    /// Token account for token exchange
    pub master_receive_token_account: Account<TokenAccount>,
    pub initalizer: AccountInfo,
    /// The address of `EscrowAccount`. Have to check if the `EscrowAccount` follows certain constraints.
    pub escrow_account: Box<Account<EscrowAccount>>,
}

#[derive(Accounts)]
pub struct Cancel<'info> {
    /// The initializer of `EscrowAccount`
    pub master: AccountInfo,
    /// The address of token account for token exchange
    pub master_deposit_token_account: Account<TokenAccount>,
    /// The program derived address (PDA)
    pub vault_account: Account<TokenAccount>,
    /// The program derived address (PDA)
    pub vault_authority: Account<TokenAccount>,
    /// The address of `EscrowAccount`. Have to check if the `EscrowAccount` follows certain constraints.
    pub escrow_account: Box<Account<EscrowAccount>>,
    /// The address of `TokenProgram`
    pub token_program: AccountInfo,
}
